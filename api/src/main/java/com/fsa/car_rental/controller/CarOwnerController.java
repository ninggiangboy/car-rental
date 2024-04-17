package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.car.CarOwnerResponse;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.CarOwnerService;
import com.fsa.car_rental.service.CarService;
import com.fsa.car_rental.service.RentalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/car-owners")
@RequiredArgsConstructor
@Slf4j
public class CarOwnerController extends BaseController {
    private final CarOwnerService carOwnerService;
    private final CarService carService;
    private final RentalService rentalService;

    @GetMapping("/info/{id}")
    public ResponseEntity<ResultResponse> getRentInfo(@PathVariable("id") UUID id) {
        CarOwnerResponse carOwner = carOwnerService.getCarOwnerResponse(id);
        return buildResponse("Car Owner detail", carOwner);
    }

    @GetMapping("/cars")
    public ResponseEntity<ResultResponse> getOwnCars(
            @RequestParam(required = false, name = "page", defaultValue = "1") int page,
            @RequestParam(required = false, name = "perPage", defaultValue = "12") int size,
            @RequestParam(required = false, name = "sort") List<String> sort,
            @RequestParam(required = false, name = "carStatus") CarStatus status,
            Authentication authentication
    ) {
        var user = (User) authentication.getPrincipal();
        var cars = carService.getAll(user.getId(), page, size, sort, status);
        return buildResponse("My cars", cars);
    }

    @GetMapping("/cars/{id}/bookings")
    public ResponseEntity<ResultResponse> getBookingHistoryCar(
        @PathVariable("id") Integer id,
        @RequestParam(required = false, name = "page", defaultValue = "1") int page,
        @RequestParam(required = false, name = "perPage", defaultValue = "6") int size,
        @RequestParam(required = false, name = "status") List<RentalStatus> status,
        @RequestParam(required = false, name = "sort", defaultValue = "desc") String sort,
        @RequestParam(required = false, name = "rating") List<Integer> rating,
        Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        if (status != null && status.isEmpty()) {
            status = null;
        }
        var cars = carService.getBookingHistoryCar(user, id, status, page, size, rating, sort);
        return buildResponse("Booking history", cars);
    }

    @RequestMapping("/cars/{id}/change-status")
    public ResponseEntity<ResultResponse> changeCarStatus(@PathVariable("id") Integer id,
                                                          Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        carService.changeStatus(user, id);
        return buildResponse("Car status has been changed successfully");
    }

    @GetMapping("/cars/revenue")
    public ResponseEntity<ResultResponse> viewRevenue(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return buildResponse("Revenue", carOwnerService.getRevenue(user));
    }

    @GetMapping("/cars/{id}/revenue")
    public ResponseEntity<ResultResponse> viewCarRevenue(
            @PathVariable Integer id, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var carRevenue = carService.getCarRevenue(user, id);
        return buildResponse("Rental information", carRevenue);
    }

    @GetMapping("/cars/recent-rents")
    public ResponseEntity<ResultResponse> viewRecentRental(Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        return buildResponse("Recent information", carService.getRecentRental(user.getId()));
    }

}
