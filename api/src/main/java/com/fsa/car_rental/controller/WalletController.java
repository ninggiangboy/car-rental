package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.payment.TransactionStatus;
import com.fsa.car_rental.constant.payment.TransactionType;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.dto.wallet.WalletInfo;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("${prefix.api}/wallets")
@RequiredArgsConstructor
public class WalletController extends BaseController {

    private final PaymentService paymentService;

    @GetMapping("/balance")
    public ResponseEntity<ResultResponse> getBalance(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        BigDecimal balance = paymentService.checkBalance(user);
        return buildResponse("Balance", balance);
    }

    @RequestMapping("/top-up")
    public ResponseEntity<ResultResponse> topUp(
            @RequestParam("amount") BigDecimal amount,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        String transactionCode = paymentService.topUp(user, amount, "");
        return buildResponse("Transfer successful", transactionCode);
    }

    @RequestMapping("/withdraw")
    public ResponseEntity<ResultResponse> withdraw(
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("bank") String bank,
            @RequestParam("bankNumber") String number,
            @RequestParam("bankCode") String code,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        String transactionCode = paymentService.withdraw(user, amount, "", bank, number, code);
        return buildResponse("Transfer successful", transactionCode);
    }

    @RequestMapping("/confirm")
    public ResponseEntity<ResultResponse> confirm(
            @RequestParam("code") String code
    ) {
        paymentService.confirm(code);
        return buildResponse("Confirm successful");
    }

    @GetMapping("/info")
    public ResponseEntity<ResultResponse> getPendingReceive(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        WalletInfo info = paymentService.getWalletInfo(user);

        return buildResponse("Information", info);
    }

    @GetMapping("/transactions-history")
    public ResponseEntity<ResultResponse> getTransactionHistory(
            @RequestParam(required = false, name = "start")
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate start,
            @RequestParam(required = false, name = "end")
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end,
            @RequestParam(required = false, name = "status") TransactionStatus status,
            @RequestParam(required = false, name = "type") TransactionType type,
            @RequestParam(required = false, name = "page", defaultValue = "1") int page,
            @RequestParam(required = false, name = "method") PaymentMethod method,
            @RequestParam(required = false, name = "perPage", defaultValue = "10") int size,
            @RequestParam(required = false, name = "sort", defaultValue = "desc") String sort,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Page<TransactionResponse> transactionHistory = paymentService.getTransactionHistory(
                user, start, end, status, type, method, page, size, sort
        );
        return buildResponse("Transaction history", transactionHistory);
    }
}
