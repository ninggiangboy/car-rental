package com.fsa.car_rental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.util.UUID;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "wallet", schema = "car_rental")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "wallet_id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "balance", precision = 10, scale = 2)
    private BigDecimal balance;

}