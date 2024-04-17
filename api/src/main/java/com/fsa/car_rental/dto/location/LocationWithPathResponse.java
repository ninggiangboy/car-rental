package com.fsa.car_rental.dto.location;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationWithPathResponse {
    private String id;
    private String path;
}