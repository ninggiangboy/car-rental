package com.fsa.car_rental.dto.location;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
public class LocationResponse {
    private String id;
    private String name;
}
