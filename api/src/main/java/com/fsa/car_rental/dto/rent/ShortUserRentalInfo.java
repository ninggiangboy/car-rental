package com.fsa.car_rental.dto.rent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShortUserRentalInfo {
    private UUID userId;
    private Long totalCompletedRides;
    private Double rateCompletedRent;
    private Instant lastRent;

    public ShortUserRentalInfo(UUID id, Long totalRides, Long totalCompletedRides, Instant lastRent, Integer num) {
        this.userId = id;
        this.totalCompletedRides = totalCompletedRides;
        this.rateCompletedRent = (totalRides != null && totalRides > 0)
                ? (Double.valueOf(totalCompletedRides) / totalRides * 100)
                : 0.0;
        this.lastRent = lastRent;
    }
}
