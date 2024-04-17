package com.fsa.car_rental.dto.wallet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletInfo {
    private BigDecimal pendingReceive;
    private BigDecimal pendingPayment;
    private BigDecimal pendingReceiveWallet;
    private BigDecimal pendingPaymentWallet;
}
