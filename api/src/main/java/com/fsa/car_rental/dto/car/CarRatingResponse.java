package com.fsa.car_rental.dto.car;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarRatingResponse {
    private String fullName;
    private String image;
    private String comment;
    private Integer rating;
    private Instant createdAt;

    public String getComment() {
        comment = comment == null ? "" : comment;
        return comment;
    }
}
