package com.fsa.car_rental.entity;

import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "transactions", schema = "car_rental")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "transaction_id")
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Column(name = "payment_method", length = Integer.MAX_VALUE)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @NotNull
    @Column(name = "transaction_type", length = Integer.MAX_VALUE)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(name = "transaction_desc", length = Integer.MAX_VALUE)
    private String transactionDesc;

    @Column(name = "transaction_code", length = Integer.MAX_VALUE)
    private String transactionCode;

    @Column(name = "transaction_status", length = Integer.MAX_VALUE)
    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;

    @Column(name = "created_at")
    private Instant createdAt;
}