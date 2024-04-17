package com.fsa.car_rental.dto.car;

import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * DTO for {@link com.fsa.car_rental.entity.Car}
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CarDetailResponse implements Serializable {
    private Integer id;
    private String licensePlate;
    private String modelName;
    private String brandName;
    private Set<String> featureNames;
    private String colorName;
    private Integer year;
    private Integer numberOfSeats;
    private Integer mileage;
    private TransmissionType transmissionType;
    private FuelType fuelType;
    private CarStatus status;
    private BigDecimal fuelConsumption;
    private BigDecimal basePrice;
    private BigDecimal deposit;
    private List<String> images;
    private String description;
    private String termOfUse;
    private String carOwnerId;
    private String location;
    private Instant createdAt;
    private Long numberOfRides;
    private Double rating;
}