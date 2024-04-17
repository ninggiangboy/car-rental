package com.fsa.car_rental.dto.rent;

import lombok.*;

import java.time.Instant;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RentRequest {
    private Integer carId;
    private String renterId;
    private Instant startDate;
    private Instant endDate;
    private RentInfo renter;
    private RentInfo driver;
}
