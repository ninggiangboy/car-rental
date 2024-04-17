package com.fsa.car_rental.service;

import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.entity.Transaction;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.entity.Wallet;
import com.fsa.car_rental.repository.TransactionRepository;
import com.fsa.car_rental.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
public class AutoCancelTransaction implements Runnable {
    private final TransactionRepository transactionRepository;
    private final UUID transactionId;
    private final Wallet wallet;
    private final WalletRepository walletRepository;
    private final User user;
    private final EmailService emailService;

    @Override
    public void run() {
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        if (transaction != null && TransactionStatus.PENDING.equals(transaction.getTransactionStatus())) {
            transaction.setTransactionStatus(TransactionStatus.FAILED);
            if (TransactionType.WITHDRAWAL.equals(transaction.getTransactionType()) || wallet != null) {
                wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
                walletRepository.save(wallet);
            }
            transactionRepository.save(transaction);
        }
        sendAutoCancelMail(user, "Dear " + user.getFullName() + ", your transaction has been canceled");
    }

    private void sendAutoCancelMail(User user, String subject) {
        Map<String, Object> model = new HashMap<>();
        model.put("dear ", "Dear " + user.getFullName() + ", \n");
        model.put("message",
                "We regret to inform you that the transaction you initiated has been " +
                        "canceled due to an issue with our system. " +
                        "We apologize for any inconvenience caused and appreciate your understanding.");
        emailService.send(subject, user.getEmail(), "email/notifications.html", model);
    }
}
