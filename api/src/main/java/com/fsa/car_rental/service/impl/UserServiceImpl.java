package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.constant.storage.FileType;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.dto.car.CarListResponse;
import com.fsa.car_rental.dto.register.RegisterRequest;
import com.fsa.car_rental.dto.rent.FullUserRentalInfo;
import com.fsa.car_rental.dto.rent.ShortUserRentalInfo;
import com.fsa.car_rental.dto.user.ProfileResponse;
import com.fsa.car_rental.dto.user.UpdateProfileRequest;
import com.fsa.car_rental.entity.Role;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.entity.Wallet;
import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.exception.DuplicateException;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.repository.WalletRepository;
import com.fsa.car_rental.service.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final PasswordEncoder encoder;
    private final WalletRepository walletRepository;
    private final CarService carService;
    private final ModelMapper mapper;
    @Value("${link.front-end-domain}")
    private String domain;
    @Value("${link.forgot-password-verify}")
    private String resetPasswordVerifyLink;
    private final StorageService storageService;
    @Value("${link.confirm-email-verify}")
    private String confirmEmailVerifyLink;

    @Override
    public User createUser(RegisterRequest registerRequest) {
        User user = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);
        if (user == null) {
            user = mapper.map(registerRequest, User.class);
            user.setPassword(encoder.encode(registerRequest.getPassword()));
            user.setRole(Role.builder().id(registerRequest.getRoleId()).build());
            user.setEmailVerified(false);
            user.setIsBlocked(false);
            return userRepository.save(user);
        } else
            return user;
    }

    //Cheking user existed
    public void resetPassword(String email) {
        //Find by email
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException("Not found user")
        );
        String resetToken = tokenService.generateVerifyToken(user);
        sendEmailResetPassword(user, resetToken);
    }

    //Send email
    private void sendEmailResetPassword(User user, String token) {
        String subject = "CarRental - Reset your password, " + user.getFullName();
        Map<String, Object> model = new HashMap<>();
        String link = domain + resetPasswordVerifyLink + token;
        model.put("link", link);
        model.put("name", user.getFullName());
        emailService.send(subject, user.getEmail(), "email/forgot-password.html", model);
    }

    // Reset password
    public void resetPasswordWithToken(String token, String newPassword) {
        UUID userId = tokenService.getTokenInfo(token, TokenType.VERIFIED);
        //Find by ID
        User user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException("Invalid Token")
        );
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        tokenService.revokeAllUserTokens(user, TokenType.VERIFIED);
    }

    @Override
    public ProfileResponse getProfile(User user) {
        return mapper.map(user, ProfileResponse.class);
    }

    @Override
    public void updateProfile(User user, UpdateProfileRequest request, String password) {
        if (password == null || !encoder.matches(password, user.getPassword()))
            throw new ClientErrorException("Password not matches");
        var oldEmail = user.getEmail();
        mapper.map(request, user);
        Optional.ofNullable(request.getImage())
                .ifPresent(image -> user.setImage(storageService.getUrl(storageService.store(FileType.IMAGE, image))));
        Optional.ofNullable(request.getDriverLicense())
                .ifPresent(license -> user.setDriverLicense(storageService.getUrl(storageService.store(FileType.IMAGE, license))));
        Optional.ofNullable(request.getEmail())
                .ifPresent(email -> {
                    if (email.equals(oldEmail))
                        return;
                    if (userRepository.existsByEmail(email)) throw new DuplicateException("Duplicate email");
                    user.setEmailVerified(false);
                    sendVerificationEmail(user, tokenService.generateVerifyToken(user));
                });
        userRepository.save(user);
    }

    public void sendVerificationEmail(User user, String confirmToken) {
        String subject = "CarRental - Confirm your email address, " + user.getFullName();
        Map<String, Object> model = new HashMap<>();
        String link = domain + confirmEmailVerifyLink + confirmToken;
        model.put("link", link);
        model.put("name", user.getFullName());
        emailService.send(subject, user.getEmail(), "email/email-confirmation.html", model);
    }

    @Override
    @Transactional
    public void confirmEmail(String token) {
        UUID userId = tokenService.getTokenInfo(token, TokenType.VERIFIED);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User " + userId + " not found"));
        user.setEmailVerified(true);
        userRepository.save(user);
        if (user.getWallet() == null) {
            walletRepository.save(Wallet.builder()
                    .user(user)
                    .balance(BigDecimal.valueOf(0))
                    .build());
        }
        tokenService.revokeAllUserTokens(user, TokenType.VERIFIED);
    }

    @Override
    public void changePassword(User currentUser, String oldPassword, String newPassword) {
        if (!encoder.matches(oldPassword, currentUser.getPassword())) {
            throw new ClientErrorException("Old password is incorrect");
        }
        currentUser.setPassword(encoder.encode(newPassword));
        tokenService.revokeAllUserTokens(currentUser, TokenType.REFRESH);
        userRepository.save(currentUser);
    }

    @Override
    public ShortUserRentalInfo getShortUserRentInfo(UUID id) {
        return userRepository.getUserRentInfo(id);
    }

    @Override
    public FullUserRentalInfo getFullUserRentInfo(UUID id) {
        return userRepository.getFullUserRentInfo(id);
    }

    @Override
    public List<CarListResponse> getUserCarsBooked(UUID userId) {
        return carService.getUserCarsBooked(userId);
    }
}
