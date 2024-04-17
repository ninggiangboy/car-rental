package com.fsa.car_rental.dto.rent;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    Revenue monthRevenue;
    BigDecimal totalRevenue;
    Double avgRating;
    Long totalRides;

    @Builder
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Revenue {
        BigDecimal currentMonthRevenue;
        BigDecimal previousMonthRevenue;
        Double growthRevenueRate;
    }
}
