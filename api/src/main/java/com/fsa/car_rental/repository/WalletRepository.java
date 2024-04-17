package com.fsa.car_rental.repository;

import com.fsa.car_rental.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserId(UUID userId);
}
