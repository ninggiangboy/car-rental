package com.fsa.car_rental.service;

import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
public class AutoCancelTask implements Runnable {

    private final RentalRepository rentalRepository;
    private final Integer rentalId;
    private final RentalStatus rentalStatus;
    private final EmailService emailService;

    @Override
    public void run() {
        var rental = rentalRepository.findById(rentalId).orElseThrow();
        if (rentalStatus.equals(rental.getRentalStatus())) {
            rental.setRentalStatus(RentalStatus.CANCELLED);
            rentalRepository.save(rental);
        }
        User user = rental.getRenter();
        String subject = "Dear " + user.getFullName() + ", your rental has been canceled";
        sendAutoCancelMail(user, subject);

    }

    private void sendAutoCancelMail(User user, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear ", "Dear " + user.getFullName() + ", \n");
        model.put("message",
                "We regret to inform you that the rental you requested has been canceled. " +
                        "Unfortunately, the car owner did not confirm the rental within the specified time frame, " +
                        "leading to the cancellation of the reservation." +
                        "Thank you for your understanding and patience in this matter.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }
}
