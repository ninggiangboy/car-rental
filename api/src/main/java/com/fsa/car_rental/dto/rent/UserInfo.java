package com.fsa.car_rental.dto.rent;

import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserInfo {
    private UUID id;
    private String name;
    private String phoneNumber;
    private String email;
    private String image;
}
