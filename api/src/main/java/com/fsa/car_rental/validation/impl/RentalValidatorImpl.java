package com.fsa.car_rental.validation.impl;

import com.fsa.car_rental.validation.RentalValidator;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class RentalValidatorImpl implements RentalValidator {

    @Override
    public void validateTime(Instant start, Instant end) {
        if (end.isBefore(start))
            throw new IllegalArgumentException("End date cannot be before start date");
        if (Instant.now().isAfter(end))
            throw new IllegalArgumentException("End date cannot be before now");
    }
}
