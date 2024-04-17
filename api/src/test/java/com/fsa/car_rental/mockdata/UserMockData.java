package com.fsa.car_rental.mockdata;

import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
public class UserMockData {
    private final UserRepository userRepository;
    public static final User user = User.builder()
            .id(UUID.fromString("3806b140-79c7-4825-b364-9d168ca7e70c"))
            .email("user@email.com")
            .password("1234")
            .isEmailVerified(true)
            .isBlocked(false)
            .build();
    public static final User blockedUser = User.builder()
            .id(UUID.randomUUID())
            .email("blockedUser@email.com")
            .password("1234")
            .isEmailVerified(true)
            .isBlocked(true)
            .build();
    public static final User unverifiedUser = User.builder()
            .id(UUID.fromString("addaf1fb-52cb-4c3d-980b-21788498b09a"))
            .email("unverifiedUser@email.com")
            .password("1234")
            .isEmailVerified(false)
            .isBlocked(false)
            .build();
}
