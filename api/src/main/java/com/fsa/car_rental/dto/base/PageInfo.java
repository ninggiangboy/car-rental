package com.fsa.car_rental.dto.base;

import lombok.Builder;

@Builder
public record PageInfo(
        Integer page,
        Integer pageSize,
        Long totalElements,
        Integer totalPages,
        Boolean hasPrev,
        Boolean hasNext
) {
}
