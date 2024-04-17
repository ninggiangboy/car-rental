package com.fsa.car_rental.dto.car;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarAvailableResponse {
    private Instant startDate;
    private Instant endDate;
}
