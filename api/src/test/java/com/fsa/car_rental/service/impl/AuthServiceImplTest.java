package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.auth.AuthRequest;
import com.fsa.car_rental.dto.auth.AuthResponse;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.mockdata.UserMockData;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.JwtService;
import com.fsa.car_rental.service.TokenService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private TokenService tokenService;
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    @Test
    void authService_Login_ValidUser_ReturnAuthResponse() {
        User user = UserMockData.user;
        AuthRequest authRequest = AuthRequest.builder()
                .email(user.getUsername())
                .password(user.getPassword())
                .build();

        Mockito.when(authenticationManager
                        .authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        Mockito.when(authentication
                .getPrincipal()).thenReturn(user);
        Mockito.when(jwtService
                        .generateToken(Mockito.any(User.class)))
                .thenReturn("jwtToken");
        Mockito.when(tokenService
                        .generateRefreshToken(Mockito.any(User.class)))
                .thenReturn("refreshToken");

        AuthResponse authResponse = authService.login(authRequest);
        Assertions.assertEquals("jwtToken", authResponse.getAccessToken());
        Assertions.assertEquals("refreshToken", authResponse.getRefreshToken());
    }

    @Test
    void authService_RefreshToken_ValidToken_ReturnAuthResponse() {
        User user = UserMockData.user;

        Mockito.when(tokenService
                        .getTokenInfo(Mockito.any(String.class), Mockito.any(TokenType.class)))
                .thenReturn(user.getId());
        Mockito.when(userRepository
                        .findById(Mockito.any(UUID.class)))
                .thenReturn(Optional.of(user));
        Mockito.when(jwtService
                        .generateToken(Mockito.any(User.class))).
                thenReturn("jwtToken");
        Mockito.when(tokenService
                        .generateRefreshToken(Mockito.any(User.class))).
                thenReturn("refreshToken");

        AuthResponse authResponse = authService.refreshToken("token");
        Assertions.assertEquals("jwtToken", authResponse.getAccessToken());
        Assertions.assertEquals("refreshToken", authResponse.getRefreshToken());
    }

    @Mock
    private RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PATTERN = "%s::%s::%s";

    @Test
    void authService_Logout_ValidUser_callRevokeRefreshToken() {
        User user = UserMockData.user;
        AuthRequest authRequest = AuthRequest.builder()
                .email(user.getUsername())
                .password(user.getPassword())
                .build();
        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("accessToken")
                .refreshToken("refreshToken")
                .build();
        authService.logout(authResponse.getRefreshToken(), user);
        Mockito.verify(tokenService).revokeRefreshToken(authResponse.getRefreshToken(), user);
    }
}