package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.auth.AuthRequest;
import com.fsa.car_rental.dto.auth.AuthResponse;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.AuthService;
import com.fsa.car_rental.service.JwtService;
import com.fsa.car_rental.service.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    /**
     * Authenticates the user using email and password.
     * If authentication is successful, it generates a JWT and refresh token and returns them in AuthResponse.
     *
     * @param authRequest contains email and password of the user
     * @return AuthResponse containing access and refresh tokens
     */
    @SneakyThrows
    @Override
    @Transactional
    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()));
        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Refreshes the access token and returns a new access token and refresh token.
     *
     * @param refreshToken the refresh token
     * @return the auth response containing the new access and refresh tokens
     */
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        UUID userId = tokenService.getTokenInfo(refreshToken, TokenType.REFRESH);
        User user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException("User not found"));
        String accessToken = jwtService.generateToken(user);
        String newRefreshToken = tokenService.generateRefreshToken(user);
        tokenService.revokeRefreshToken(refreshToken, user);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    /**
     * Logs out the user by revoking the refresh token.
     *
     * @param refreshToken the refresh token
     * @param user         the user
     */
    @Override
    public void logout(String refreshToken, User user) {
        tokenService.revokeRefreshToken(refreshToken, user);
    }
}
