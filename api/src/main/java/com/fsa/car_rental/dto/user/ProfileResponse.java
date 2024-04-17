package com.fsa.car_rental.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String image;
    private String nationalId;
    private String driverLicense;
}
