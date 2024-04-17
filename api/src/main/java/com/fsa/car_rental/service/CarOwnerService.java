package com.fsa.car_rental.service;

import com.fsa.car_rental.dto.car.CarOwnerResponse;
import com.fsa.car_rental.dto.rent.RevenueResponse;
import com.fsa.car_rental.entity.User;

import java.util.UUID;

public interface CarOwnerService {
    CarOwnerResponse getCarOwnerResponse(UUID id);
    RevenueResponse getRevenue(User user);
}
