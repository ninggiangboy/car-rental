package com.fsa.car_rental.dto.transaction;

import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    @Getter(AccessLevel.NONE)
    private String transactionCode;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private String transactionDesc;
    private PaymentMethod paymentMethod;
    private Instant createdAt;
    private BigDecimal amount;

    public String getTransactionCode() {
        return transactionCode.contains("_") ? transactionCode.split("_")[1] : transactionCode;
    }

    public String getBookingNo() {
        return !TransactionType.TOP_UP.equals(transactionType) && !TransactionType.WITHDRAWAL.equals(transactionType) ?
                transactionCode.split("_")[0] : null;
    }
}
