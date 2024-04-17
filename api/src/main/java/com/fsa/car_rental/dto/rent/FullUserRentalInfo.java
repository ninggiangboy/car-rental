package com.fsa.car_rental.dto.rent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FullUserRentalInfo {
    private UUID userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String image;
    private Integer age;
    private Long totalCompletedRides;
    private Double rateCompletedRent;
    private Instant lastRent;

    public FullUserRentalInfo(
            UUID id,
            String fullName,
            String email,
            String phoneNumber,
            String image,
            LocalDate dob,
            Long totalRides,
            Long totalCompletedRides,
            Instant lastRent,
            Integer num) {
        this.userId = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.image = image;
        this.age = dob != null ? Instant.now().atZone(ZoneId.systemDefault()).getYear() - dob.getYear() : 0;
        this.totalCompletedRides = totalCompletedRides;
        this.rateCompletedRent = (totalRides != null && totalRides > 0)
                ? (Double.valueOf(totalCompletedRides) / totalRides * 100)
                : 0.0;
        this.lastRent = lastRent;
    }
}
