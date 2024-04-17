package com.fsa.car_rental.dto.rent;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RentInfo {
    private String name;
    private String phoneNumber;
    private String nationalId;
    private String driverLicense;
}
