package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController extends BaseController {

    private final UserService userService;

    @GetMapping("{id}/statistic")
    public ResponseEntity<ResultResponse> getCustomerInfo(@PathVariable UUID id) {
        var userInfo = userService.getShortUserRentInfo(id);
        return buildResponse("Customer detail", userInfo);
    }

    @GetMapping("{id}/profile")
    public ResponseEntity<ResultResponse> getCustomerProfile(@PathVariable UUID id) {
        var userInfo = userService.getFullUserRentInfo(id);
        return buildResponse("Customer profile", userInfo);
    }

    @GetMapping("{id}/cars-booked")
    public ResponseEntity<ResultResponse> getCustomerCarsBooked(@PathVariable UUID id) {
        var cars = userService.getUserCarsBooked(id);
        return buildResponse("Customer cars booked", cars);
    }
}
