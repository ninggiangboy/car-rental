package com.fsa.car_rental.service;

import com.fsa.car_rental.dto.auth.AuthRequest;
import com.fsa.car_rental.dto.auth.AuthResponse;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.NotFoundException;

public interface AuthService {
    /**
     * Handles user login and generates authentication tokens.
     *
     * @param authRequest The login request containing username and password.
     * @return An AuthResponse object containing the generated access and refresh tokens.
     */
    AuthResponse login(AuthRequest authRequest);

    /**
     * Refreshes an expired access token using a valid refresh token.
     *
     * @param refreshToken The refresh token received from the client.
     * @return An AuthResponse object containing a new access token (if refresh is successful)
     * or null if the refresh token is invalid or expired.
     * @throws NotFoundException If the user associated with the refresh token is not found
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Invalidates a refresh token, effectively logging out the user.
     *
     * @param refreshToken The refresh token to be revoked.
     * @param user         The user associated with the refresh token.
     */
    void logout(String refreshToken, User user);
}
