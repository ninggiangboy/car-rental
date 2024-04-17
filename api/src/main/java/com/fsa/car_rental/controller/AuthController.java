package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.dto.auth.AuthRequest;
import com.fsa.car_rental.dto.auth.AuthResponse;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${prefix.api}/auth")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResultResponse> authenticate(
            @Valid @RequestBody AuthRequest authRequest
    ) {
        AuthResponse authResponse = authService.login(authRequest);
        return buildResponse("Login result", authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ResultResponse> refreshToken(
            @RequestParam("refreshToken") String refreshToken
    ) {
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return buildResponse("Refresh token successfully", authResponse);
    }

    @DeleteMapping("/logout")
    public ResponseEntity<ResultResponse> logout(
            @RequestParam("refreshToken") String refreshToken,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        authService.logout(refreshToken, user);
        return buildResponse("Logout successfully");
    }

}
