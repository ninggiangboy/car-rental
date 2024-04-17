package com.fsa.car_rental.dto.car;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarOwnerResponse {
    private String fullName;
    private String picture;
    private double averageRating;
    private Long totalRides;
    private Instant joinDate;
}
