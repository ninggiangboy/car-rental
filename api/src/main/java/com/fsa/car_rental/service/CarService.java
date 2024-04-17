package com.fsa.car_rental.service;

import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.car.CarAvailableResponse;
import com.fsa.car_rental.dto.car.CarDetailResponse;
import com.fsa.car_rental.dto.car.CarListResponse;
import com.fsa.car_rental.dto.car.CarRatingResponse;
import com.fsa.car_rental.dto.rent.BookingListRecord;
import com.fsa.car_rental.dto.rent.RecentRentResponse;
import com.fsa.car_rental.dto.rent.RevenueResponse;
import com.fsa.car_rental.entity.User;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface CarService {

    /**
     * Retrieves a paginated list of cars based on specified search criteria.
     *
     * @param page               The page number (1-indexed) of the result set.
     * @param size               The number of items per page in the result set.
     * @param sort               The sorting order for the result set in the format "property:direction".
     *                           Example: "basePrice:asc" for ascending order of base price.
     * @param location           The ID of the address to filter cars by.
     * @param brandIds           List of brand IDs to filter cars by.
     * @param colorIds           List of color IDs to filter cars by.
     * @param minYear            The minimum manufacturing year to filter cars by.
     * @param maxYear            The maximum manufacturing year to filter cars by.
     * @param numberOfSeats      List of seat numbers to filter cars by.
     * @param fuels              List of fuel types to filter cars by.
     * @param transmissions      List of transmission types to filter cars by.
     * @param minFuelConsumption The minimum fuel consumption to filter cars by.
     * @param maxFuelConsumption The maximum fuel consumption to filter cars by.
     * @param minPrice           The minimum base price to filter cars by.
     * @param maxPrice           The maximum base price to filter cars by.
     * @param isDepositPaid      The deposit payment status to filter cars by.
     *                           Should be a valid boolean value (true or false).
     * @param features           List of feature IDs to filter cars by.
     * @param status             The status of cars to filter by.
     * @return A {@link Page} containing the requested cars.
     */
    Page<CarListResponse> getAll(
            int page, int size,
            List<String> sort,
            String location,
            List<Integer> brandIds,
            List<Integer> colorIds,
            Integer minYear, Integer maxYear,
            List<Integer> numberOfSeats,
            List<FuelType> fuels,
            List<TransmissionType> transmissions,
            BigDecimal minFuelConsumption, BigDecimal maxFuelConsumption,
            BigDecimal minPrice, BigDecimal maxPrice,
            String isDepositPaid,
            List<Integer> features,
            CarStatus status,
            Instant start,
            Instant end
    );

    Page<CarListResponse> getAll(UUID id, int page, int size, List<String> sort, CarStatus status);

    List<CarAvailableResponse> getAvailableDateList(Integer id);

    CarDetailResponse getCarDetail(Integer carId);

    Page<CarRatingResponse> getCarRating(Integer carId, int page, int size);

    List<CarListResponse> referenceList(Integer carId);

    Page<BookingListRecord> getBookingHistoryCar(User user, Integer carId, List<RentalStatus> status,
                                                 int page, int size, List<Integer> rating, String sort);

    void changeStatus(User user, Integer id);

    RevenueResponse getCarRevenue(User user, Integer id);

    List<CarListResponse> getUserCarsBooked(UUID userId);

    List<RecentRentResponse> getRecentRental(UUID userId);
}
