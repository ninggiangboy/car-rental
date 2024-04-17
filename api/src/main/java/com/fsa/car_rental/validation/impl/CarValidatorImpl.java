package com.fsa.car_rental.validation.impl;

import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.validation.CarValidator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class CarValidatorImpl implements CarValidator {
    @Override
    public void validate(
            int page, int size,
            Integer minYear, Integer maxYear,
            List<Integer> numberOfSeats,
            BigDecimal minFuelConsumption, BigDecimal maxFuelConsumption,
            BigDecimal minPrice, BigDecimal maxPrice,
            String isNonDepositPaid
    ) {
        if (page < 1 || size < 1) {
            throw new ClientErrorException("Page and size must be greater than 0");
        }

        if (minYear != null && maxYear != null && minYear > maxYear) {
            throw new ClientErrorException("Min year must be less than max year");
        }

        if (minYear != null && minYear > LocalDate.now().getYear()) {
            throw new ClientErrorException("Min year must be less than current year");
        }

        if (minFuelConsumption != null && maxFuelConsumption != null && minFuelConsumption.compareTo(maxFuelConsumption) > 0) {
            throw new ClientErrorException("Min fuel consumption must be less than max fuel consumption");
        }

        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new ClientErrorException("Min price must be less than max price");
        }

        if (numberOfSeats != null && !numberOfSeats.isEmpty()) {
            for (Integer seat : numberOfSeats) {
                if (seat < 1) {
                    throw new ClientErrorException("Number of seats must be greater than 0");
                }
            }
        }

        if (isNonDepositPaid != null && !isNonDepositPaid.equalsIgnoreCase("true")) {
            throw new ClientErrorException("isNonDepositPaid must be true or null");
        }
    }
}
