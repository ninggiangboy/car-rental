package com.fsa.car_rental.exception.handler;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ErrorResponse(
        int status,
        String path,
        Instant timestamp,
        String message
) {
}


