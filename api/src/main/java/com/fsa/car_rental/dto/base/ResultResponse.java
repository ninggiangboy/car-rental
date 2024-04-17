package com.fsa.car_rental.dto.base;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.Instant;
import java.time.Instant;

@Builder
public record ResultResponse(
        int status,
        String message,
        Instant timestamp,
        Object result
) {
}
