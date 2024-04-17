package com.fsa.car_rental.dto.rent;

import com.fsa.car_rental.constant.rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecentRentResponse {
    private Integer carId;
    private Integer rentalId;
    private String carName;
    private String carImage;
    private Instant lastModified;
    private Instant startDate;
    private Instant endDate;
    private RentalStatus status;
    private Integer numberOfPending;
}

