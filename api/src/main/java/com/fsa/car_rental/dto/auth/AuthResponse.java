package com.fsa.car_rental.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String accessToken;
    String refreshToken;
}
