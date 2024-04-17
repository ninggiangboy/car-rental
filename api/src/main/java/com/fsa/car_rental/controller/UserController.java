package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.dto.user.UpdateProfileRequest;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.TokenService;
import com.fsa.car_rental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${prefix.api}/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserService userService;
    private final TokenService tokenService;

    // Reset request
    @PostMapping("/forgot-password")
    public ResponseEntity<ResultResponse> resetRequest(@RequestParam String email) {
        userService.resetPassword(email);
        return buildResponse("Reset password request has been sent to your email");
    }

    //Verify token
    @GetMapping("/reset-password/verify")
    public ResponseEntity<ResultResponse> verifyToken(@RequestParam String token) {
        tokenService.getTokenInfo(token, TokenType.VERIFIED);
        return buildResponse("Token is valid");
    }

    // Reset password
    @PatchMapping("/reset-password")
    public ResponseEntity<ResultResponse> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        userService.resetPasswordWithToken(token, newPassword);
        return buildResponse("Password has been reset");
    }

    @GetMapping("/profile")
    public ResponseEntity<ResultResponse> getProfile(Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var profile = userService.getProfile(user);
        return buildResponse("User profile", profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<ResultResponse> updateProfile(
            Authentication authentication,
            UpdateProfileRequest request,
            @RequestParam String password
    ) {
        var currentUser = (User) authentication.getPrincipal();
        userService.updateProfile(currentUser, request, password);
        return buildResponse("ProfileResponse has been updated");
    }

    @PutMapping("/verify")
    public ResponseEntity<ResultResponse> confirmEmail(@RequestParam String token) {
        userService.confirmEmail(token);
        return buildResponse("Confirm email successfully");
    }

    @RequestMapping("/change-password")
    public ResponseEntity<ResultResponse> changePassword(
            Authentication authentication,
            @RequestParam String oldPassword,
            @RequestParam String newPassword
    ) {
        var currentUser = (User) authentication.getPrincipal();
        userService.changePassword(currentUser, oldPassword, newPassword);
        return buildResponse("Password has been changed");
    }
}
