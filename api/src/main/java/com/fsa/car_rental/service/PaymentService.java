package com.fsa.car_rental.service;

import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.dto.wallet.WalletInfo;
import com.fsa.car_rental.entity.Rental;
import com.fsa.car_rental.entity.Transaction;
import com.fsa.car_rental.entity.User;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PaymentService {

    String topUp(User user, BigDecimal amount, String description);

    String withdraw(User user, BigDecimal amount, String description, String bank, String number, String code);

    void confirm(String code);

    String createPayDepositTransaction(Rental rental, PaymentMethod paymentMethod, String description);

    String createReturnDepositTransaction(Rental rental, PaymentMethod paymentMethod, String description);

    String createPayRentTransaction(Rental rental, PaymentMethod paymentMethod, String description, BigDecimal amount);

    void updateStatus(Integer rental, User user, TransactionStatus status, List<TransactionType> types);

    List<Transaction> getTransaction(
            String code, User user, TransactionStatus status, List<TransactionType> types
    );

    Page<TransactionResponse> getTransactionHistory(
            User user, LocalDate start, LocalDate end, TransactionStatus status,
            TransactionType type, PaymentMethod method, Integer page, Integer size, String sort
    );

    WalletInfo getWalletInfo(User user);

    BigDecimal checkBalance(User user);

    void updateBalance(User user, BigDecimal amount);
}