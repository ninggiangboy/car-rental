package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.car.CarOwnerResponse;
import com.fsa.car_rental.dto.rent.RevenueResponse;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.CarRepository;
import com.fsa.car_rental.repository.RentalRepository;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.CarOwnerService;
import com.fsa.car_rental.service.CarService;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarOwnerServiceImpl implements CarOwnerService {
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final RentalRepository rentalRepository;
    private final CarService carService;

    @Override
    @Transactional
    public CarOwnerResponse getCarOwnerResponse(UUID carOwnerId) {
        CarOwnerResponse result = new CarOwnerResponse();
        User user = userRepository.findById(carOwnerId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        result.setFullName(user.getFullName());
        result.setPicture(user.getImage());
        Tuple avgAndRide = userRepository.findAvgAndRideByOwnerId(carOwnerId);
        double avgRating = avgAndRide.get(0) != null && !avgAndRide.get(0).toString().isEmpty() ? Double.valueOf(avgAndRide.get(0).toString()) : 0.0;
        result.setAverageRating(avgRating);
        result.setTotalRides((Long) avgAndRide.get(1));
        result.setJoinDate(carRepository.findFirstRide(user.getId()));
        return result;
    }

    @Override
    public RevenueResponse getRevenue(User user) {
        Tuple totalInfo = rentalRepository.findAllRentalInfo(user.getId());
        BigDecimal currentMonthRev = totalInfo.get(0,BigDecimal.class);
        BigDecimal previousMonthRev = totalInfo.get(1, BigDecimal.class) != null
                ? totalInfo.get(1, BigDecimal.class) : null;

        BigDecimal totalRev = totalInfo.get(2,BigDecimal.class);
        Double growthRev = (previousMonthRev == null||previousMonthRev.equals(BigDecimal.valueOf(0))) ? null :
                ((currentMonthRev.subtract(previousMonthRev)).
                        divide(previousMonthRev, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue());
        Double avgRating = Optional.ofNullable(totalInfo.get(3,BigDecimal.class)).orElse(BigDecimal.ZERO).doubleValue();
        Long totalRide = totalInfo.get(4,Long.class);
        return RevenueResponse.builder()
                .monthRevenue(RevenueResponse.Revenue.builder()
                        .previousMonthRevenue(previousMonthRev)
                        .currentMonthRevenue(currentMonthRev)
                        .growthRevenueRate(growthRev).build())
                .totalRevenue(totalRev)
                .avgRating(avgRating)
                .totalRides(totalRide).build();
    }
}
