package com.fsa.car_rental.dto.auth;

import com.fsa.car_rental.constant.ValidationRegex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthRequest {
    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    String email;
    @NotNull(message = "Password cannot be null")
    @NotBlank(message = "Password cannot be blank")
    String password;
}
