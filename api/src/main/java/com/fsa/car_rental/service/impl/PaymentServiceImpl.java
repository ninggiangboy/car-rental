package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.base.BaseSpecification;
import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.dto.wallet.WalletInfo;
import com.fsa.car_rental.entity.Rental;
import com.fsa.car_rental.entity.Transaction;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.entity.Wallet;
import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.TransactionRepository;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.repository.WalletRepository;
import com.fsa.car_rental.service.AutoCancelTransaction;
import com.fsa.car_rental.service.EmailService;
import com.fsa.car_rental.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.fsa.car_rental.dto.base.SearchCriterion.Operation.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;
    private final EmailService emailService;
    private final ThreadPoolTaskScheduler taskScheduler;
    private final UserRepository userRepository;
    @Value("${email.admin}")
    private String adminEmail;
    @Value("${transaction.expiration-time}")
    private Long expirationTime;
    @Value("${link.confirm-transfer}")
    private String confirmTransfer;
    @Value("${link.front-end-domain}")
    private String domain;

    private void autoCancelAtTime(UUID transactionId, Wallet wallet) {
        User user = userRepository.findById(wallet.getUser().getId())
                .orElseThrow(() -> new NotFoundException("No user found corresponding to this transaction"));
        taskScheduler.schedule(
                new AutoCancelTransaction(transactionRepository, transactionId, wallet, walletRepository, user, emailService),
                Instant.now().plus(expirationTime, ChronoUnit.MILLIS)
        );
    }

    //TODO add otp use redis
    @Override
    @Transactional
    public String topUp(User user, BigDecimal amount, String description) {
        if (description.isBlank()) {
            description = user.getFullName() + " top-up request.";
        }
        checkAmount(amount);
        String transactionCode = generateTxn(null);
        Instant createdAt = Instant.now();
        Transaction transaction = createTransaction(user.getId(), amount, TransactionType.TOP_UP,
                transactionCode, TransactionStatus.PENDING, description, createdAt, PaymentMethod.WALLET);
        Wallet wallet = getWallet(user.getId());
        autoCancelAtTime(transaction.getId(), wallet);
        String subject = "[CAR RENTAL] Top-up request";
        sendTopupEmailAdmin(adminEmail, user, subject, transaction);
        sendTopupEmailUser(user.getEmail(), user, subject, transaction);
        return transactionCode;
    }

    @Override
    @Transactional
    public String withdraw(User user, BigDecimal amount, String description,
                           String bank, String number, String code) {
        if (description.isBlank()) {
            description = user.getFullName() + " sent a withdraw request.";
        }
        checkAmount(amount);
        Wallet wallet = getWallet(user.getId());
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new ClientErrorException("Insufficient balance");
        }
        updateBalance(user, amount.negate());
        String transactionCode = generateTxn(null);
        Instant createdAt = Instant.now();
        Transaction transaction = createTransaction(user.getId(), amount, TransactionType.WITHDRAWAL,
                transactionCode, TransactionStatus.PENDING, description, createdAt, PaymentMethod.WALLET);
        autoCancelAtTime(transaction.getId(), wallet);
        String subject = "[CAR RENTAL] Withdraw request";
        sendWithdrawEmailAdmin(adminEmail, user, subject,
                transaction, bank, number);
        sendWithdrawEmailUser(user.getEmail(), user, subject,
                transaction, bank, number);
        return transactionCode;
    }

    private void sendTopupEmailAdmin(String email, User user, String subject, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        String link = domain + confirmTransfer + transaction.getTransactionCode();
        model.put("link", link);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("transactionCode", transaction.getTransactionCode());
        model.put("amount", transaction.getAmount() + " points");
        model.put("description", transaction.getTransactionDesc());
        emailService.send(subject, email, "email/topup-transactions.html", model);
    }

    private void sendTopupEmailUser(String email, User user, String subject, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("transactionCode", transaction.getTransactionCode());
        model.put("amount", transaction.getAmount() + " points");
        model.put("description", transaction.getTransactionDesc());
        model.put("status", "Pending");
        emailService.send(subject, email, "email/notifications-transactions.html", model);
    }

    private void sendWithdrawEmailAdmin(String email, User user, String subject, Transaction transaction,
                                        String bank, String number) {
        Map<String, Object> model = new HashMap<>();
        String link = domain + confirmTransfer + transaction.getTransactionCode();
        model.put("link", link);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("transactionCode", transaction.getTransactionCode());
        model.put("amount", transaction.getAmount() + " points");
        model.put("description", transaction.getTransactionDesc());
        model.put("bank", bank);
        model.put("bankNumber", number);
        emailService.send(subject, email, "email/withdraw-transactions.html", model);
    }

    private void sendWithdrawEmailUser(String email, User user, String subject, Transaction transaction,
                                       String bank, String number) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Pending");
        model.put("description", transaction.getTransactionDesc());
        emailService.send(subject, email, "email/notifications-transactions.html", model);
    }


    @Override
    @Transactional
    public void confirm(String code) {
        List<Transaction> transactions = getTransaction(code, null, TransactionStatus.PENDING, null);
        if (transactions.isEmpty()) {
            throw new NotFoundException("Transaction not found");
        }
        for (Transaction transaction : transactions) {
            if (TransactionType.TOP_UP.equals(transaction.getTransactionType()))
                updateBalance(transaction.getUser(), transaction.getAmount());
            transaction.setTransactionStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(transaction);
            User user = transaction.getUser();
            sendConfirmMail(user, "[CAR RENTAL] Transact successfully", transaction);
        }
    }

    private void sendConfirmMail(User user, String subject, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        model.put("title", subject);
        model.put("dear ", "Dear " + user.getFullName() + ", \n");
        model.put("message", "Dear " + user.getFullName() + ",\n" +
                "We are pleased to inform you that the transaction you initiated has been completed successfully. " +
                "This is its information: ");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Completed");
        model.put("description", transaction.getTransactionDesc());
        emailService.send(subject, user.getEmail(), "email/notifications-transactions.html", model);
    }

    private void checkAmount(BigDecimal amount) {
        if (BigDecimal.ZERO.compareTo(amount) > 0) {
            throw new ClientErrorException("Amount is not valid");
        }
        if (BigDecimal.valueOf(1000000).compareTo(amount) < 0) {
            throw new ClientErrorException("Amount is too high");
        }
    }

    //send mail when car transaction when paying deposit
    @Override
    @Transactional
    public String createPayDepositTransaction(Rental rental, PaymentMethod paymentMethod, String description) {
        String transactionCode = generateTxn(rental.getId().toString());
        Instant createdAt = Instant.now();
        TransactionStatus status = PaymentMethod.WALLET.equals(paymentMethod) ?
                TransactionStatus.COMPLETED : TransactionStatus.PENDING;
        Transaction payTransaction  = createTransaction(rental.getRenter().getId(), rental.getDeposit(),
                TransactionType.PAY_DEPOSIT, transactionCode, status, description, createdAt, paymentMethod);
        Transaction receiveTransaction = createTransaction(rental.getCar().getCarOwner().getId(), rental.getDeposit(),
                TransactionType.RECEIVE_DEPOSIT, transactionCode, status, description, createdAt, paymentMethod);
        if (PaymentMethod.WALLET.equals(paymentMethod)) {
            updateBalance(rental.getRenter(), rental.getDeposit().negate());
            updateBalance(rental.getCar().getCarOwner(), rental.getDeposit());
        }
        User carOwner = rental.getCar().getCarOwner();
        User renter = rental.getRenter();
        if (paymentMethod.equals(PaymentMethod.WALLET)){
            sendPayDepositCarOwnerWithPoint(carOwner, receiveTransaction);
            sendPayDepositRenterWithPoint(renter, payTransaction);
        }
        return transactionCode;
    }

    private void sendPayDepositCarOwnerWithPoint(User user, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Received");
        model.put("description", "Deposit received successfully");
        String subject = "[CAR RENTAL] Deposit Payment Information";
        emailService.send(subject, user.getEmail(), "email/notifications-transactions.html", model);
    }

    private void sendPayDepositRenterWithPoint(User user, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Paid");
        model.put("description", "Deposit sent successfully");
        String subject = "[CAR RENTAL] Thank you for paying your deposit";
        emailService.send(subject, user.getEmail(), "email/notifications-transactions.html", model);
    }


    @Override
    @Transactional
    public String createReturnDepositTransaction(Rental rental, PaymentMethod paymentMethod, String description) {
        String transactionCode = generateTxn(rental.getId().toString());
        Instant createdAt = Instant.now();
        TransactionStatus status = PaymentMethod.WALLET.equals(paymentMethod) ?
                TransactionStatus.COMPLETED : TransactionStatus.PENDING;
        if (RentalStatus.PENDING_PICKUP.equals(rental.getRentalStatus())) {
            String code = rental.getId().toString().concat("_");
            List<Transaction> transactions = getTransaction(code, null, TransactionStatus.PENDING,
                    List.of(TransactionType.PAY_DEPOSIT, TransactionType.RECEIVE_DEPOSIT));
            if (!transactions.isEmpty()) {
                transactions.forEach(transaction -> transaction.setTransactionStatus(TransactionStatus.FAILED));
                transactionRepository.saveAll(transactions);
                return null;
            } else {
                updateBalance(rental.getRenter(), rental.getDeposit());
                updateBalance(rental.getCar().getCarOwner(), rental.getDeposit().negate());
            }
        }
        createTransaction(rental.getRenter().getId(), rental.getDeposit(), TransactionType.RECEIVE_REFUND,
                transactionCode, status, description, createdAt, paymentMethod);
        createTransaction(rental.getCar().getCarOwner().getId(), rental.getDeposit(), TransactionType.REFUND_DEPOSIT,
                transactionCode, status, description, createdAt, paymentMethod);

        return transactionCode;
    }

    @Override
    @Transactional
    public String createPayRentTransaction(Rental rental, PaymentMethod paymentMethod, String description, BigDecimal amount) {
        String transactionCode = generateTxn(rental.getId().toString());
        Instant createdAt = Instant.now();
        TransactionStatus status = PaymentMethod.WALLET.equals(paymentMethod) ?
                TransactionStatus.COMPLETED : TransactionStatus.PENDING;
        Transaction payRent = createTransaction(rental.getRenter().getId(), rental.getTotalPrice(), TransactionType.PAY_RENT, transactionCode,
                status, description, createdAt, paymentMethod);
        Transaction receiveRent = createTransaction(rental.getCar().getCarOwner().getId(), rental.getTotalPrice(), TransactionType.RECEIVE_RENT,
                transactionCode, status, description, createdAt, paymentMethod);
        if (BigDecimal.ZERO.compareTo(amount) < 0) {
            updateBalance(rental.getRenter(), amount);
            updateBalance(rental.getCar().getCarOwner(), amount.negate());
        }

        User carOwner = rental.getCar().getCarOwner();
        User renter = rental.getRenter();
        if (paymentMethod.equals(PaymentMethod.WALLET)){
            sendReceiveRentCarOwnerWithPoint(carOwner, receiveRent);
            sendPayRentRenterWithPoint(renter, payRent);
        }
        return transactionCode;
    }

    private void sendPayRentRenterWithPoint(User user, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Sent");
        model.put("description", "Rent payment sent successfully");
        String subject = "[CAR RENTAL] Rent Payment Information";
        emailService.send(subject, user.getEmail(), "email/notifications-transactions.html", model);
    }

    private void sendReceiveRentCarOwnerWithPoint(User user, Transaction transaction) {
        Map<String, Object> model = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'XXX").withZone(ZoneId.systemDefault());
        model.put("time", formatter.format(transaction.getCreatedAt()));
        model.put("fullName", user.getFullName());
        model.put("amount", transaction.getAmount() + " points");
        model.put("status", "Received");
        model.put("description", "Rent payment received successfully");
        String subject = "[CAR RENTAL] Rent Payment Information";
        emailService.send(subject, user.getEmail(), "email/notifications-transactions.html", model);
    }

    @Override
    @Transactional
    public void updateStatus(Integer rentalId, User user, TransactionStatus status, List<TransactionType> types) {
        String code = rentalId == null ? null : rentalId.toString().concat("_");
        List<Transaction> transactions = getTransaction(code, user, TransactionStatus.PENDING, types);
        transactions.stream()
                .filter((transaction) -> types.contains(transaction.getTransactionType()))
                .forEach((transaction) -> transaction.setTransactionStatus(status));
        transactionRepository.saveAll(transactions);
    }

    @Override
    public List<Transaction> getTransaction(
            String code, User user, TransactionStatus status, List<TransactionType> types
    ) {
        Sort sortField = Sort.by(Sort.Direction.valueOf("DESC"), Rental.Fields.createdAt);
        BaseSpecification<Transaction> spec = new BaseSpecification<>();
        spec.where(LIKE_START, Transaction.Fields.transactionCode,
                code, code != null);
        spec.and(EQUAL, Transaction.Fields.user, user, user != null);
        spec.and(EQUAL, Transaction.Fields.transactionStatus, status, status != null);
        spec.and(IN, Transaction.Fields.transactionType, types, types != null);

        return transactionRepository.findAll(spec, sortField);
    }

    @Override
    public Page<TransactionResponse> getTransactionHistory(
            User user, LocalDate start, LocalDate end, TransactionStatus status,
            TransactionType type, PaymentMethod method, Integer page, Integer size, String sort
    ) {
        Sort sortField = Sort.by(Sort.Direction.valueOf(sort.toUpperCase()), Rental.Fields.createdAt);
        Pageable pageable = PageRequest.of(page - 1, size, sortField);
        BaseSpecification<Transaction> spec = new BaseSpecification<>();
        spec.where(EQUAL, Transaction.Fields.user, user, true);
        spec.and(EQUAL, Transaction.Fields.transactionStatus, status, status != null);
        spec.and(EQUAL, Transaction.Fields.transactionType, type, type != null);
        spec.and(EQUAL, Transaction.Fields.paymentMethod, method, method != null);
        spec.and(BETWEEN, Transaction.Fields.createdAt, Arrays.asList(start, end), start != null && end != null);

        return transactionRepository.findAll(spec, pageable)
                .map((element) -> modelMapper.map(element, TransactionResponse.class));
    }

    @Override
    public WalletInfo getWalletInfo(User user) {
        List<TransactionType> receive = List.of(
                TransactionType.RECEIVE_DEPOSIT,
                TransactionType.RECEIVE_RENT,
                TransactionType.RECEIVE_REFUND,
                TransactionType.TOP_UP
        );
        List<TransactionType> pay = List.of(
                TransactionType.PAY_DEPOSIT,
                TransactionType.PAY_RENT,
                TransactionType.REFUND_DEPOSIT,
                TransactionType.WITHDRAWAL
        );
        return WalletInfo.builder()
                .pendingPayment(getTotalPending(user, pay, PaymentMethod.CASH))
                .pendingPaymentWallet(getTotalPending(user, pay, PaymentMethod.WALLET))
                .pendingReceive(getTotalPending(user, receive, PaymentMethod.CASH))
                .pendingReceiveWallet(getTotalPending(user, receive, PaymentMethod.WALLET))
                .build();
    }

    private BigDecimal getTotalPending(User user, List<TransactionType> types, PaymentMethod method) {
        return transactionRepository
                .findByUserAndTransactionStatus(user, TransactionStatus.PENDING, types, method)
                .orElse(BigDecimal.ZERO);
    }

    @Override
    @Transactional
    public BigDecimal checkBalance(User user) {
        Wallet wallet = getWallet(user.getId());

        return wallet.getBalance();
    }

    @Override
    @Transactional
    public void updateBalance(User user, BigDecimal amount) {
        Wallet wallet = getWallet(user.getId());
        if (wallet.getBalance().add(amount).compareTo(BigDecimal.ZERO) < 0)
            throw new ClientErrorException("Insufficient balance");
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }

    private Wallet getWallet(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Wallet not found"));
    }

    private Transaction createTransaction(UUID userId, BigDecimal amount, TransactionType type, String txn, TransactionStatus status,
                                          String description, Instant createdAt, PaymentMethod paymentMethod
    ) {
        Transaction transaction = Transaction.builder()
                .transactionCode(txn)
                .amount(amount)
                .transactionType(type)
                .transactionDesc(description)
                .user(User.builder().id(userId).build())
                .paymentMethod(paymentMethod)
                .transactionStatus(status)
                .createdAt(createdAt)
                .build();
        transaction = transactionRepository.save(transaction);
        return transaction;
    }

    private String generateTxn(String id) {
        if (id == null)
            return UUID.randomUUID().toString().replace("-", "");
        return id.concat("_").concat(UUID.randomUUID().toString().replace("-", ""));
    }
}
