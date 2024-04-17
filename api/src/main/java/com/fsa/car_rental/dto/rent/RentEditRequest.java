package com.fsa.car_rental.dto.rent;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RentEditRequest {
    private Integer carId;
    private String renterId;
    private RentInfo renter;
    private RentInfo driver;
}
