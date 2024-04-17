package com.fsa.car_rental.validation;

import java.math.BigDecimal;
import java.util.List;

public interface CarValidator {

    /**
     * Validates the input parameters for searching cars.
     *
     * @param page               The page number (1-indexed) of the result set.
     * @param size               The number of items per page in the result set.
     * @param minYear            The minimum manufacturing year to filter cars by.
     * @param maxYear            The maximum manufacturing year to filter cars by.
     * @param numberOfSeats      List of seat numbers to filter cars by.
     * @param minFuelConsumption The minimum fuel consumption to filter cars by.
     * @param maxFuelConsumption The maximum fuel consumption to filter cars by.
     * @param minPrice           The minimum base price to filter cars by.
     * @param maxPrice           The maximum base price to filter cars by.
     * @param isNonDepositPaid   The non-deposit payment status to filter cars by. Should be a valid boolean value (true or false).
     * @throws IllegalArgumentException If page is less than 1, size is less than or equal to 0, or any other input validation fails.
     *                                  Additionally, if isNonDepositPaid is provided and is not a valid boolean value.
     */
    void validate(
            int page, int size,
            Integer minYear, Integer maxYear,
            List<Integer> numberOfSeats,
            BigDecimal minFuelConsumption, BigDecimal maxFuelConsumption,
            BigDecimal minPrice, BigDecimal maxPrice,
            String isNonDepositPaid
    );
}
