package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.register.RegisterRequest;
import com.fsa.car_rental.service.RegisterService;
import com.fsa.car_rental.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${prefix.api}/register")
@RequiredArgsConstructor
public class RegisterController extends BaseController {
    private final RegisterService registerService;
    private final TokenService tokenService;

    /**
     * Register a new user.
     *
     * @param registerRequest the user information
     * @return the result of the operation
     */
    @PostMapping()
    public ResponseEntity<ResultResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest) {
        registerService.register(registerRequest);
        return buildResponse("Register successfully");
    }
}
