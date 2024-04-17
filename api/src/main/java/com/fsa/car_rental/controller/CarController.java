package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import com.fsa.car_rental.dto.car.CarDetailResponse;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.car.CarAvailableResponse;
import com.fsa.car_rental.dto.car.CarListResponse;
import com.fsa.car_rental.dto.car.CarOwnerResponse;
import com.fsa.car_rental.dto.car.CarRatingResponse;
import com.fsa.car_rental.service.CarOwnerService;
import com.fsa.car_rental.service.CarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor
@Slf4j
public class CarController extends BaseController {

    private final CarService carService;

    private final CarOwnerService carOwnerService;

    @GetMapping()
    public ResponseEntity<ResultResponse> getAll(
            @RequestParam(required = false, name = "page", defaultValue = "1") int page,
            @RequestParam(required = false, name = "perPage", defaultValue = "12") int size,
            @RequestParam(required = false, name = "sort") List<String> sort,
            @RequestParam(required = false, name = "location") String location,
            @RequestParam(required = false, name = "brand") List<Integer> brandIds,
            @RequestParam(required = false, name = "color") List<Integer> colorIds,
            @RequestParam(required = false, name = "minYear") Integer minYear,
            @RequestParam(required = false, name = "maxYear") Integer maxYear,
            @RequestParam(required = false, name = "numberOfSeats") List<Integer> numberOfSeats,
            @RequestParam(required = false, name = "fuelType") List<FuelType> fuels,
            @RequestParam(required = false, name = "transmissionType") List<TransmissionType> transmissions,
            @RequestParam(required = false, name = "minFuelConsumption") BigDecimal minFuelConsumption,
            @RequestParam(required = false, name = "maxFuelConsumption") BigDecimal maxFuelConsumption,
            @RequestParam(required = false, name = "minPrice") BigDecimal minPrice,
            @RequestParam(required = false, name = "maxPrice") BigDecimal maxPrice,
            @RequestParam(required = false, name = "isNonDepositPaid") String isNonDepositPaid,
            @RequestParam(required = false, name = "feature") List<Integer> featureIds,
            @RequestParam(required = false, name = "carStatus") CarStatus status,
            @RequestParam(required = false, name = "checkin") Instant start,
            @RequestParam(required = false, name = "checkout") Instant end
    ) {
        Page<CarListResponse> result =
                carService.getAll(page, size, sort,
                        location, brandIds, colorIds,
                        minYear, maxYear, numberOfSeats,
                        fuels, transmissions,
                        minFuelConsumption, maxFuelConsumption,
                        minPrice, maxPrice, isNonDepositPaid, featureIds, status,
                        start, end
                );
        return buildResponse("Search car result", result);
    }

    @GetMapping("/{id}/available-dates")
    public ResponseEntity<ResultResponse> getAvailableDate(@PathVariable Integer id) {
        List<CarAvailableResponse> availableDateList = carService.getAvailableDateList(id);
        return buildResponse("Car Available Time", availableDateList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getDetail(@PathVariable("id") Integer id) {
        CarDetailResponse car = carService.getCarDetail(id);
        return buildResponse("Car detail", car);
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<ResultResponse> getRating(
            @PathVariable("id") Integer id,
            @RequestParam(required = false, name = "page", defaultValue = "1") int page,
            @RequestParam(required = false, name = "perPage", defaultValue = "5") int size
    ) {
        Page<CarRatingResponse> carRating = carService.getCarRating(id, page, size);
        return buildResponse("Car rating detail", carRating);
    }

    @GetMapping("/{id}/related-cars")
    public ResponseEntity<ResultResponse> getReference(@PathVariable("id") Integer id) {
        List<CarListResponse> carRefList = carService.referenceList(id);
        return buildResponse("Reference Car", carRefList);
    }

}
