package com.fsa.car_rental.dto.register;

import com.fsa.car_rental.constant.ValidationRegex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * The RegisterRequest class is a request object that is used to register a new user.
 * It contains the user's email, full name, phone number, password, and role ID.
 * The isEmailVerified field is used to indicate whether the user's email has been verified or not.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be valid", regexp = ValidationRegex.EMAIL_REGEX)
    @NotBlank(message = "Email cannot be blank")
    private String email;
    @Size(min = 1, max = 100, message = "Full name must be between 1 and 100 characters")
    private String fullName;
    @Size(max = 20, message = "Phone number must be at most 20 characters")
    private String phoneNumber;
    @NotNull(message = "Password cannot be null")
    @NotBlank(message = "Password cannot be blank")
    private String password;
    private Integer roleId;
    private boolean isEmailVerified;
}
