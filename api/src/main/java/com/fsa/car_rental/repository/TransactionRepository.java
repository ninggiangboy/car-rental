package com.fsa.car_rental.repository;

import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.entity.Transaction;
import com.fsa.car_rental.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {

    @Query(value = """
                        SELECT SUM(t.amount)
                        FROM Transaction t
                        WHERE t.user = :user
                        AND t.transactionStatus = :status
                        AND t.transactionType IN :types
                        AND t.paymentMethod = :paymentMethod
            """)
    Optional<BigDecimal> findByUserAndTransactionStatus(
            User user, TransactionStatus status, List<TransactionType> types, PaymentMethod paymentMethod
    );
}