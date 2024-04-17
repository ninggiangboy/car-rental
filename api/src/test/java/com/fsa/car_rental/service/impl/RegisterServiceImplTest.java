package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.dto.register.RegisterRequest;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.DuplicateException;
import com.fsa.car_rental.mockdata.RegisterMockData;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.EmailService;
import com.fsa.car_rental.service.TokenService;
import com.fsa.car_rental.service.UserService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegisterServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private TokenService tokenService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private RegisterServiceImpl registerService;

    int index = 0;
    static List<RegisterRequest> mockDataList;

    @BeforeAll
    static void init() {
        mockDataList = RegisterMockData.registerMockList();
    }

    RegisterRequest registerRequest;
    User user;

    @BeforeEach
    void setUp() {
        registerRequest = mockDataList.get(0);
        user = User.builder()
                .id(UUID.randomUUID())
                .email(registerRequest.getEmail())
                .phoneNumber(registerRequest.getPhoneNumber())
                .password(registerRequest.getPassword())
                .isEmailVerified(registerRequest.isEmailVerified())
                .isBlocked(false)
                .build();
    }
    /*
     * @Test
     * void testRegister_duplicateEmail_notActivated() {
     * when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(
     * Optional.of(user));
     * DuplicateException exception = assertThrows(DuplicateException.class, () -> {
     * registerService.register(registerRequest);
     * });
     *
     * assertEquals("Please activate your account using the verification link sent to your email address."
     * ,
     * exception.getMessage());
     * }
     *
     * @Test
     * void testRegister_duplicateEmail_Activated() {
     * when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(
     * Optional.of(user));
     * //when(userService.createUser(any(RegisterRequest.class))).thenReturn(user);
     * DuplicateException exception = assertThrows(DuplicateException.class, () -> {
     * registerService.register(registerRequest);
     * });
     * assertEquals("This email is being used by another user",
     * exception.getMessage());
     * }
     */

    @Test
    void testRegister_duplicateEmail() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(user));

        DuplicateException exception2 = assertThrows(DuplicateException.class, () -> {
            registerService.register(registerRequest);
        });
        assertEquals("This email is being used by another user", exception2.getMessage());
    }

    // @Test
    // void testRegister() {

    //     when(userService.createUser(any(RegisterRequest.class))).thenReturn(user);
    //     when(tokenService.generateVerifyToken(any(User.class))).thenReturn("mockToken");
    //     String token = registerService.register(registerRequest);
    //     assertEquals(token, "mockToken");
    // }

    @Test
    void testConfirmEmail() {
        User user = new User();
        when(tokenService.getTokenInfo(anyString(), eq(TokenType.VERIFIED))).thenReturn(UUID.randomUUID());
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(user));
        userService.confirmEmail("mockToken");
//        assertTrue(user.getIsEmailVerified());
        verify(tokenService, times(1)).revokeAllUserTokens(user, TokenType.VERIFIED);
    }
}
