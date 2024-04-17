package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.dto.register.RegisterRequest;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.DuplicateException;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.RegisterService;
import com.fsa.car_rental.service.TokenService;
import com.fsa.car_rental.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final TokenService tokenService;

    @Override
    @Transactional
    public void register(RegisterRequest registerRequest) {
        User user = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);
        if (user == null) {
            user = userService.createUser(registerRequest);
        } else {
            if (!user.isEmailVerified()) {
                tokenService.revokeAllUserTokens(user, TokenType.VERIFIED);
                userRepository.delete(user);
                user = userService.createUser(registerRequest);
            } else {
                throw new DuplicateException("This email is being used by another user");
            }
        }
        String confirmToken = tokenService.generateVerifyToken(user);
        userService.sendVerificationEmail(user, confirmToken);
    }

    /**
     * Sends an email to the user to help them confirm their registration
     *
     * @param user         the user to send the email to
     * @param confirmToken the verification token
     */
}
