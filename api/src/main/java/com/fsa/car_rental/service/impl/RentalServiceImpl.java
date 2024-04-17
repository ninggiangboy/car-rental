package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.constant.RoleId;
import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.rent.*;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.entity.*;
import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.CarAvailableDateRepository;
import com.fsa.car_rental.repository.CarRepository;
import com.fsa.car_rental.repository.RentalRepository;
import com.fsa.car_rental.service.AutoCancelTask;
import com.fsa.car_rental.service.EmailService;
import com.fsa.car_rental.service.PaymentService;
import com.fsa.car_rental.service.RentalService;
import com.fsa.car_rental.validation.RentalValidator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final CarRepository carRepository;
    private final CarAvailableDateRepository carAvailableDateRepository;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final ThreadPoolTaskScheduler taskScheduler;
    private final ModelMapper mapper;
    @Value("${link.front-end-domain}")
    private String domain;
    @Value("${rental.expiration-after-confirm}")
    private Long expirationAfterConfirm;

    private final RentalValidator rentalValidator;

    private final List<RentalStatus> status = List.of(RentalStatus.PENDING, RentalStatus.PENDING_DEPOSIT, RentalStatus.PENDING_PICKUP);

    private void autoCancelAtTime(Integer rentalId, Instant start, RentalStatus rentalStatus) {
        Instant time = start.isBefore(Instant.now().plus(expirationAfterConfirm, ChronoUnit.MILLIS)) ?
                start : Instant.now().plus(expirationAfterConfirm, ChronoUnit.MILLIS);
        taskScheduler.schedule(
                new AutoCancelTask(rentalRepository, rentalId, rentalStatus, emailService),
                time
        );
    }

    @Override
    @Transactional
    public Integer rentCar(RentRequest request, User user) {
        if (!RoleId.CUSTOMER.role().equals(user.getRole()))
            throw new ClientErrorException("Dont have permission to rent");
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new NotFoundException("Car " + request.getCarId() + " not found"));
        if (car.getStatus() != CarStatus.AVAILABLE)
            throw new NotFoundException("This car is not available");
        Instant start = request.getStartDate();
        Instant end = request.getEndDate();
        rentalValidator.validateTime(start, end);
        if (checkAvailableDate(start, end, car) == null)
            throw new NotFoundException("Car not available for rental");
        BigDecimal amount = car.getBasePrice().multiply(BigDecimal.valueOf(
                Math.ceil(ChronoUnit.HOURS.between(request.getStartDate(), request.getEndDate()) / 24.0)
        ));
        RentalPerson driver = null;
        if (request.getDriver() != null) {
            driver = mapper.map(request.getDriver(), RentalPerson.class);
        }
        Instant now = Instant.now();
        Rental rental = Rental.builder()
                .car(car)
                .renter(user)
                .rentalStart(start)
                .rentalEnd(end)
                .rentalStatus(RentalStatus.PENDING)
                .totalPrice(amount)
                .deposit(car.getDeposit())
                .driver(driver)
                .createdAt(now)
                .lastModifiedAt(now)
                .renterPerson(mapper.map(request.getRenter(), RentalPerson.class))
                .build();
        rental = rentalRepository.save(rental);
        autoCancelAtTime(rental.getId(), start, RentalStatus.PENDING);
        String subject = "[CAR RENTAL] A new rent request has been sent";
        sendRentCarMailCarOwner(car.getCarOwner(), rental.getRenter(), rental, subject);
        sendRentCarMailRenter(car.getCarOwner(), rental.getRenter(), rental, subject);
        return rental.getId();
    }

    private void sendRentCarMailCarOwner(User user, User renter, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "You have a new rent request");
        model.put("message",
                "One of your car has been booked by " + renter.getFullName() + ". Please check rental #" +
                        rental.getId() + " on your dashboard for more information. ");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendRentCarMailRenter(User user, User renter, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "You have a new rent request");
        model.put("message",
                "Thank you for booking a car from " + user.getFullName() + ". Please check rental #" +
                        rental.getId() + " on your dashboard for more information. ");
        emailService.send(subject, renter.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public void rejectRental(Integer id, User user) {
        reject(id, user);
    }

    private void reject(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        if (!status.contains(rental.getRentalStatus()))
            throw new IllegalStateException("Cannot reject because because it in" + rental.getRentalStatus() + "status");
        if (!RentalStatus.PENDING.equals(rental.getRentalStatus()))
            updateAvailableDateCancel(rental.getRentalStart(), rental.getRentalEnd(), rental.getCar());
        if (BigDecimal.ZERO.compareTo(rental.getDeposit()) < 0
                && RentalStatus.PENDING_PICKUP.equals(rental.getRentalStatus()))
            paymentService.createReturnDepositTransaction(
                    rental, PaymentMethod.WALLET, "Return deposit of rental #" + rental.getId() + " because of car owner reject.");

        paymentService.updateStatus(rental.getId(), null, TransactionStatus.FAILED, List.of(TransactionType.PAY_DEPOSIT, TransactionType.RECEIVE_DEPOSIT));
        rental.setRentalStatus(RentalStatus.REJECTED);
        rentalRepository.save(rental);
        String subject = "[CAR RENTAL] Your rent request has been rejected";
        sendRejectMail(rental.getRenter(), rental, subject);
    }

    private void sendRejectMail(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Your request has been rejected");
        model.put("message",
                "Unfortunately, the car owner has decided to deny your rental request #" + rental.getId()
                        + ". You can still try to find another car that suitable for you on our website. " +
                        "\n Thank you for your understanding.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public void confirmRental(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        if (!RentalStatus.PENDING.equals(rental.getRentalStatus())) {
            throw new IllegalStateException("Cannot confirm because because it in " + rental.getRentalStatus() + "status");
        }
        updateAvailableDateRent(rental.getRentalStart(), rental.getRentalEnd(), rental.getCar());
        rental.setRentalStatus(RentalStatus.PENDING_PICKUP);
        if (BigDecimal.ZERO.compareTo(rental.getDeposit()) < 0) {
            rental.setRentalStatus(RentalStatus.PENDING_DEPOSIT);
            autoCancelAtTime(rental.getId(), rental.getRentalStart(), RentalStatus.PENDING_DEPOSIT);
        }
        List<Integer> list = rejectList(rental.getId(), user);
        for (Integer rent : list) {
            reject(rent, user);
        }
        rentalRepository.save(rental);
        String subject = "[CAR RENTAL] Your rent request has been accepted";
        sendConfirmMail(rental.getRenter(), rental, subject);
    }

    private void sendConfirmMail(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Your rent request has been accepted");
        model.put("message",
                "Your rental request # " + rental.getId() + " has been accepted by the car owner, " +
                        "that means your reservation is now confirmed." +
                        "Before you can proceed with the rental, we kindly ask you to complete the final step, " +
                        "which is to pay the deposit for the car. " +
                        "Thank you for using our service, and we wish you a fantastic rental experience.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public List<Integer> rejectList(Integer rentalId, User user) {
        Rental rental = getRental(rentalId);
        List<Integer> list = rentalRepository.findIdAllByCarIdAndStartAndEndAndStatus(
                rental.getCar().getId(), rental.getRentalStart(), rental.getRentalEnd(), RentalStatus.PENDING
        );
        list.remove(rentalId);
        return list;
    }

    @Override
    @Transactional
    public void payDeposit(Integer id, PaymentMethod paymentMethod, User user, String description) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CUSTOMER.role());
        if (BigDecimal.ZERO.equals(rental.getDeposit()))
            throw new IllegalStateException("Cannot pay deposit because because it is zero");
        if (!RentalStatus.PENDING_DEPOSIT.equals(rental.getRentalStatus()))
            throw new IllegalStateException("Cannot pay deposit because because it in " + rental.getRentalStatus() + "status");

        if (description.isBlank()) description = "Pay deposit for rental #" + rental.getId();
        paymentService.createPayDepositTransaction(rental, paymentMethod, description);
        rental.setRentalStatus(RentalStatus.PENDING_PICKUP);
        rentalRepository.save(rental);
        if (paymentMethod.equals(PaymentMethod.WALLET)) {
            sendPayDepositMailRenterbyWallet(user, rental, "[CAR RENTAL] Thank you for paying your deposit");
            sendPayDepositMailCarOwnerbyWallet(user, rental.getCar().getCarOwner(), rental, "[CAR RENTAL] The renter has paid deposit");
        } else {
            sendPayDepositMailCarOwner(user, rental.getCar().getCarOwner(), rental, paymentMethod.name(),
                    "[CAR RENTAL] The renter has choose " + paymentMethod.name() + " as payment method");
        }
    }

    private void sendPayDepositMailRenterbyWallet(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Deposit paid successfully");
        model.put("message",
                "Your transaction of rental #" + rental.getId() + " has been processed, and the carowner have received your deposit." +
                        "You can now go ahead and pick up your car, and embark on a memorable trip." +
                        "Thank you once again for choosing our platform for your car rental needs. " +
                        "We appreciate your trust and look forward to serving you.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendPayDepositMailCarOwnerbyWallet(User renter, User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Deposit received successfully");
        model.put("message",
                "The deposit payment has been successfully made by "
                        + renter.getFullName() + " for their upcoming car rental reservation #" + rental.getId() + " with you."
                        + " As the rental date approaches, we kindly remind you to prepare your car thoroughly " +
                        "for the upcoming rental. Ensuring that the vehicle is in excellent condition and ready " +
                        "for the renter's use will contribute to a positive rental experience. \n"
                        + "\nThank you for your continued partnership with us. We appreciate your trust in our " +
                        "platform and your commitment to providing exceptional car rental experiences.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendPayDepositMailCarOwner(User renter, User user, Rental rental, String paymentMethod, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Deposit received successfully");
        model.put("message",
                "Renter " + renter.getFullName() + " has decided to pay their deposit for their upcoming car" +
                        " rental reservation #" + rental.getId() + " by " + paymentMethod +
                        " As the rental date approaches, we kindly remind you to prepare your car thoroughly " +
                        "for the upcoming rental. Ensuring that the vehicle is in excellent condition and " +
                        "ready for the renter's use will contribute to a positive rental experience. \n"
                        + "\nThank you for your continued partnership with us. We appreciate your trust in " +
                        "our platform and your commitment to providing exceptional car rental experiences.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public void cancelRental(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CUSTOMER.role());
        if (!status.contains(rental.getRentalStatus()))
            throw new IllegalStateException("Cannot cancel because because it in "
                    + rental.getRentalStatus() + "status");
        if (!RentalStatus.PENDING.equals(rental.getRentalStatus()))
            updateAvailableDateCancel(rental.getRentalStart(), rental.getRentalEnd(), rental.getCar());
        if (BigDecimal.ZERO.compareTo(rental.getDeposit()) < 0 && RentalStatus.PENDING_PICKUP.equals(rental.getRentalStatus()))
            paymentService.createReturnDepositTransaction(
                    rental, PaymentMethod.WALLET, "Return deposit of rental #" + rental.getId() + " because of cancel.");

        rental.setRentalStatus(RentalStatus.CANCELLED);
        rentalRepository.save(rental);

        sendCancelRentalCarOwner(rental.getRenter(), rental.getCar().getCarOwner(), rental,
                "[CAR RENTAL] A Rent request has been canceled");
        sendCancelRentalRenter(rental.getRenter(), rental.getCar().getCarOwner(), rental,
                "[CAR RENTAL] Your rental has been cancelled successfully");
    }

    private void sendCancelRentalCarOwner(User renter, User carOwner, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + carOwner.getFullName() + ", \n");
        model.put("title", "A rent request has been canceled");
        model.put("message",
                "Rental request number #" + rental.getId() + " has been cancelled by " + renter.getFullName()
                        + " Please review your dashboard for further information regarding this cancellation.");
        emailService.send(subject, carOwner.getEmail(), "email/notifications.html", model);
    }

    private void sendCancelRentalRenter(User renter, User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rental cancel successfully");
        model.put("message",
                "Your rental request number #" + rental.getId() + " has been successfully cancelled. " +
                        "Hope to see you again.");
        emailService.send(subject, renter.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public void pickUp(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        if (!RentalStatus.PENDING_PICKUP.equals(rental.getRentalStatus())) {
            throw new ClientErrorException("Cannot pick up because it in " + rental.getRentalStatus() + " status");
        }
        rental.setRentalStatus(RentalStatus.IN_PROGRESS);
        rentalRepository.save(rental);
        paymentService.updateStatus(
                rental.getId(), null, TransactionStatus.COMPLETED, List.of(TransactionType.PAY_DEPOSIT, TransactionType.RECEIVE_DEPOSIT)
        );

        sendPickupRenter(rental.getRenter(), rental, "[CAR RENTAL] Your rental has been started");
        // sendPickupCarOwner(rental.getCar().getCarOwner(), "[CAR RENTAL] Your rental has been started");
    }

    private void sendPickupRenter(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rental start now!");
        model.put("message",
                "Your rental number #" + rental.getId() + " has been started successfully. Enjoy your trip.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendPickupCarOwner(User user, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rental start now!");
        model.put("message",
                "Your rental has been started successfully. " +
                        "Hope your car will be returned in good condition.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public void payRent(Integer id, PaymentMethod paymentMethod, User user, String description) {
        Rental rental = getRental(id);
        checkUser(user, rental, user.getRole());
        if (!RentalStatus.PENDING_PAYMENT.equals(rental.getRentalStatus()))
            throw new ClientErrorException("Cannot pay rent because it in " + rental.getRentalStatus() + " status");
        if (BigDecimal.ZERO.compareTo(rental.getDeposit()) < 0)
            paymentService.createReturnDepositTransaction(
                    rental, paymentMethod, "Return deposit for rental #" + rental.getId());

        BigDecimal amount = rental.getDeposit().subtract(rental.getTotalPrice());
        if (!BigDecimal.ZERO.equals(amount))
            checkUser(user, amount, paymentMethod);

        if (description.isBlank()) description = "Pay rent for rental #" + rental.getId();
        ;
        paymentService.createPayRentTransaction(rental, paymentMethod, description, amount);
        rental.setRentalStatus(PaymentMethod.WALLET.equals(paymentMethod) ?
                RentalStatus.COMPLETED : RentalStatus.PENDING_CONFIRM_PAYMENT
        );
        if (paymentMethod.equals(PaymentMethod.WALLET)) {
            sendPayRentMailRenterbyWallet(user, rental, "[CAR RENTAL] Thank you for paying your rental");
            sendPayRentMailCarOwnerbyWallet(user, rental.getCar().getCarOwner(), rental, "[CAR RENTAL] The renter has paid the rental");
        }
//        else{
//            sendPayDepositMailCarOwner(user, rental.getCar().getCarOwner(), rental, paymentMethod.name(),
//                    "[CAR RENTAL] The renter has choose " + paymentMethod.name() + " as payment method");
//        }
        rentalRepository.save(rental);
    }

    private void sendPayRentMailRenterbyWallet(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rent paid successfully");
        model.put("message",
                "Your transaction of rental #" + rental.getId() + " has been processed, and the carowner have received your rent." +
                        "Thank you for your payment.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendPayRentMailCarOwnerbyWallet(User renter, User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rent received successfully");
        model.put("message",
                "The rent has been successfully made by "
                        + renter.getFullName() + " for their rental reservation #" + rental.getId() + " with you."
                        + " Thank you for your car.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void checkUser(User user, BigDecimal amount, PaymentMethod paymentMethod) {
        if (BigDecimal.ZERO.compareTo(amount) < 0) {
            if (RoleId.CUSTOMER.role().equals(user.getRole()))
                throw new ClientErrorException("You dont need to pay this rental");
        }
        if (BigDecimal.ZERO.compareTo(amount) > 0) {
            if (RoleId.CAR_OWNER.role().equals(user.getRole()))
                throw new ClientErrorException("You dont need to pay this rental");
        }
        if (PaymentMethod.WALLET.equals(paymentMethod) && amount.abs().compareTo(user.getWallet().getBalance()) > 0)
            throw new ClientErrorException("Insufficient balance");
    }

    @Override
    @Transactional
    public void confirmPayment(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        if (!RentalStatus.PENDING_CONFIRM_PAYMENT.equals(rental.getRentalStatus()))
            throw new IllegalStateException("Cannot complete because it in " + rental.getRentalStatus() + "status");

        if (BigDecimal.ZERO.compareTo(rental.getDeposit()) != 0)
            paymentService.updateStatus(rental.getId(), null, TransactionStatus.COMPLETED, List.of(TransactionType.REFUND_DEPOSIT, TransactionType.RECEIVE_REFUND));

        paymentService.updateStatus(rental.getId(), null, TransactionStatus.COMPLETED, List.of(TransactionType.PAY_RENT, TransactionType.RECEIVE_RENT));
        rental.setRentalStatus(RentalStatus.COMPLETED);
        rentalRepository.save(rental);
    }

    @Override
    @Transactional
    public void returnCar(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        if (!RentalStatus.IN_PROGRESS.equals(rental.getRentalStatus()))
            throw new ClientErrorException("Cannot return car because it in " + rental.getRentalStatus() + " status");

        rental.setRentalStatus(RentalStatus.PENDING_PAYMENT);
        if (rental.getDeposit().equals(rental.getTotalPrice())) {
            PaymentMethod method = paymentService
                    .getTransaction(rental.getId().toString().concat("_"), null, null, List.of(TransactionType.PAY_DEPOSIT))
                    .get(0).getPaymentMethod();
            paymentService.createReturnDepositTransaction(rental, method, "Return deposit for rental #" + rental.getId());
            paymentService.createPayRentTransaction(rental, method, "Pay rent fee for rental #" + rental.getId(), rental.getTotalPrice());
        }
        sendRenturnCar(user, rental, "[CAR RENTAL] Rental ended");
        rentalRepository.save(rental);
    }

    private void sendRenturnCar(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Rental ended");
        model.put("message",
                "The rental number #" + rental.getId() + " has been completed. Thank you for your car.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private Rental getRental(Integer id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rental " + id + " not found"));
    }

    private void checkUser(User user, Rental rental, Role role) {
        if (!user.getRole().getId().equals(role.getId())) {
            throw new ClientErrorException("You dont have permission to access");
        }
        if (RoleId.CUSTOMER.role().equals(user.getRole()) && !rental.getRenter().getId().equals(user.getId())) {
            throw new ClientErrorException("You are not the renter of this rental");
        }
        if (RoleId.CAR_OWNER.role().equals(user.getRole()) && !rental.getCar().getCarOwner().getId().equals(user.getId())) {
            throw new ClientErrorException("You are not the car owner of this rental");
        }
    }

    private CarAvailableDate checkAvailableDate(Instant start, Instant end, Car car) {
        return carAvailableDateRepository
                .findByCarIdAndStartDateBeforeAndEndDateAfter(car.getId(), start, end)
                .orElse(null);
    }

    private void updateAvailableDateRent(Instant start, Instant end, Car car) {
        CarAvailableDate availableDate = checkAvailableDate(start, end, car);
        if (availableDate == null)
            throw new NotFoundException("Car not available for rental");

        carAvailableDateRepository.delete(availableDate);
        carAvailableDateRepository.save(CarAvailableDate.builder()
                .car(car)
                .startDate(availableDate.getStartDate())
                .endDate(start)
                .build()
        );
        carAvailableDateRepository.save(CarAvailableDate.builder()
                .car(car)
                .startDate(end)
                .endDate(availableDate.getEndDate())
                .build());
    }

    private void updateAvailableDateCancel(Instant start, Instant end, Car car) {
        CarAvailableDate availableDate = checkAvailableDate(start, end, car);
        if (availableDate == null) {
            CarAvailableDate endDate = carAvailableDateRepository
                    .findByCarIdAndStartDate(car.getId(), end)
                    .orElse(null);
            CarAvailableDate startDate = carAvailableDateRepository
                    .findByCarIdAndEndDate(car.getId(), start)
                    .orElse(null);
            if (startDate != null) carAvailableDateRepository.delete(startDate);
            if (endDate != null) carAvailableDateRepository.delete(endDate);
            carAvailableDateRepository.save(CarAvailableDate.builder()
                    .car(car)
                    .startDate(startDate == null ? start : startDate.getStartDate())
                    .endDate(endDate == null ? end : endDate.getEndDate())
                    .build()
            );
        }
    }

    @Scheduled(fixedDelay = 24 * 60 * 60 * 1000)
    public void clearAvailableDate() {
        var previous = Instant.now().atZone(ZoneId.systemDefault()).minusDays(30).toInstant();
        carAvailableDateRepository.deleteByEndDateBefore(previous);
    }

    @Override
    @Transactional
    public void editRental(RentEditRequest request, Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CUSTOMER.role());
        if (!status.contains(rental.getRentalStatus())) {
            throw new IllegalStateException("Cannot edit because because it in " + rental.getRentalStatus() + " status");
        }
        RentInfo renter = request.getRenter();
        RentInfo driver = request.getDriver();
        RentalPerson renterPerson = RentalPerson.builder()
                .phoneNumber(renter.getPhoneNumber())
                .name(renter.getName())
                .nationalId(renter.getNationalId())
                .driverLicense(renter.getDriverLicense())
                .build();
        rental.setRenterPerson(renterPerson);
        if (driver == null) {
            rental.setDriver(null);
        } else {
            RentalPerson driverPerson = RentalPerson.builder()
                    .phoneNumber(driver.getPhoneNumber())
                    .name(driver.getName())
                    .nationalId(driver.getNationalId())
                    .driverLicense(driver.getDriverLicense())
                    .build();
            rental.setDriver(driverPerson);
        }
        rentalRepository.save(rental);
        sendEditRentalRenter(rental.getRenter(), rental, "[CAR RENTAL] Update your rental information successfully");
        sendEditRentalCarOwner(rental.getCar().getCarOwner(), rental.getRenter(), rental,
                "[CAR RENTAL] Rental information has been updated");
    }

    private void sendEditRentalRenter(User user, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "Change rental information successfully");
        model.put("message",
                "You have successfully edit your rental information number #" + rental.getId() +
                        ". If you have any further adjustments, don't hesitate to update it.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    private void sendEditRentalCarOwner(User user, User renter, Rental rental, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear", "Dear " + user.getFullName() + ", \n");
        model.put("title", "A renter has changed their rental information");
        model.put("message",
                "We wanted to inform you that " + renter.getFullName() + " has edited their rental information number #" + rental.getId() +
                        ". Please check the updated information on your dashboard.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }

    @Override
    @Transactional
    public RentResponse getRentalInformation(Integer id, User user) {
        Rental rental = rentalRepository.findByIdAndRenter_Id(id, user.getId())
                .orElseThrow(() -> new NotFoundException("Rental " + id + " not found"));
        return RentResponse.builder()
                .id(rental.getId())
                .carId(rental.getCar().getId())
                .renterId(rental.getRenter().getId().toString())
                .deposit(rental.getDeposit())
                .startDate(rental.getRentalStart())
                .endDate(rental.getRentalEnd())
                .status(rental.getRentalStatus())
                .totalPrice(rental.getTotalPrice())
                .driver(rental.getDriver() != null ? mapper.map(rental.getDriver(), RentInfo.class) : null)
                .renter(rental.getRenterPerson() != null ? mapper.map(rental.getRenterPerson(), RentInfo.class) : null)
                .build();
    }

//    @Override
//    @Transactional
//    public RentResponse getRentalInformation(Integer id, User user) {
//        Rental rental = rentalRepository.findByIdAndRenter_Id(id, user.getId())
//                .orElseThrow(() -> new NotFoundException("Rental " + id + " not found"));
//        return RentResponse.builder()
//                .driver(rental.getDriver() != null ? mapper.map(rental.getDriver(), DriverInfo.class) : null)
//                .renter(rental.getRenterPerson() != null ? mapper.map(rental.getRenterPerson(), RenterInfo.class) : null)
//                .build();
//    }

    private void sendEmail(User user, String subject, String content) {
        emailService.send(subject, user.getEmail(), content);
    }

    @Override
    public Page<BookingListResponse> viewMyBookingList(UUID userId, List<RentalStatus> status, String sort, int page, int size) {
        Sort sortField = Sort.by(Sort.Direction.valueOf(sort.toUpperCase()), Rental.Fields.createdAt, Rental.Fields.id);
        Pageable pageable = PageRequest.of(page - 1, size, sortField);
        if (status != null && status.isEmpty()) status = null;
        return rentalRepository.findByRenterId(userId, status, pageable);
    }

    @Override
    @Transactional
    public List<TransactionResponse> getRentalTransaction(Integer id, User user) {
        Rental rental = getRental(id);
        checkUser(user, rental, RoleId.CAR_OWNER.role());
        return paymentService.getTransaction(id + "\\_", user, null, null)
                .stream().map(element -> mapper.map(element, TransactionResponse.class)).toList();
    }
}
