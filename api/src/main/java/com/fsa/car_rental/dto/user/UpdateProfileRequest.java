package com.fsa.car_rental.dto.user;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpdateProfileRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private Instant dateOfBirth;
    private MultipartFile image;
    private String nationalId;
    private MultipartFile driverLicense;
}
