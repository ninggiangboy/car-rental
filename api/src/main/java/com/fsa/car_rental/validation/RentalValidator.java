package com.fsa.car_rental.validation;

import java.time.Instant;

public interface RentalValidator {
    void validateTime(Instant start, Instant end);
}
