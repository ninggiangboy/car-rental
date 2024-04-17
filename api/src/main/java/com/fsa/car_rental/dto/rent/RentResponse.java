package com.fsa.car_rental.dto.rent;

import com.fsa.car_rental.constant.rental.RentalStatus;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.time.Instant;

@FieldNameConstants
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RentResponse {
    private Integer id;
    private Integer carId;
    private String renterId;
    private Instant startDate;
    private Instant endDate;
    private RentalStatus status;
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private RentInfo renter;
    private RentInfo driver;
}
