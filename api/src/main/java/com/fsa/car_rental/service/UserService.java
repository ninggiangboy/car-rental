package com.fsa.car_rental.service;

import com.fsa.car_rental.dto.car.CarListResponse;
import com.fsa.car_rental.dto.register.RegisterRequest;
import com.fsa.car_rental.dto.rent.FullUserRentalInfo;
import com.fsa.car_rental.dto.rent.ShortUserRentalInfo;
import com.fsa.car_rental.dto.user.ProfileResponse;
import com.fsa.car_rental.dto.user.UpdateProfileRequest;
import com.fsa.car_rental.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User createUser(RegisterRequest registerRequest);

    void resetPassword(String email);

    void resetPasswordWithToken(String token, String newPassword);

    ProfileResponse getProfile(User user);

    void updateProfile(User currentUser, UpdateProfileRequest request, String password);

    void sendVerificationEmail(User user, String confirmToken);

    void confirmEmail(String token);

    void changePassword(User currentUser, String oldPassword, String newPassword);

    ShortUserRentalInfo getShortUserRentInfo(UUID id);

    FullUserRentalInfo getFullUserRentInfo(UUID id);

    List<CarListResponse> getUserCarsBooked(UUID userId);
}

