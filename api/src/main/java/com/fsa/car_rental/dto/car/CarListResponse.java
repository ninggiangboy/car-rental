package com.fsa.car_rental.dto.car;

import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import lombok.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * DTO for {@link com.fsa.car_rental.entity.Car}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarListResponse {
    private Integer id;
    private String brandName;
    private String modelName;
    private Integer year;
    private BigDecimal basePrice;
    @Getter(AccessLevel.NONE)
    private String image;
    private List<String> images;
    private String location;
    private BigDecimal deposit;
    private Integer numberOfSeats;
    private TransmissionType transmissionType;
    private FuelType fuelType;
    private Long numberOfRides;
    private Double rating;
    private BigDecimal fuelConsumption;
    private Integer mileage;
    private CarStatus status;

    public CarListResponse(Integer id, String brandName, String modelName, Integer year, BigDecimal basePrice, String image, String location, BigDecimal deposit, Integer numberOfSeats, TransmissionType transmissionType, FuelType fuelType, Long numberOfRides, Double rating, BigDecimal fuelConsumption, Integer mileage, CarStatus status) {
        this.id = id;
        this.brandName = brandName;
        this.modelName = modelName;
        this.year = year;
        this.basePrice = basePrice;
        this.image = image;
        this.location = location;
        this.deposit = deposit;
        this.numberOfSeats = numberOfSeats;
        this.transmissionType = transmissionType;
        this.fuelType = fuelType;
        this.numberOfRides = numberOfRides;
        this.rating = rating;
        this.fuelConsumption = fuelConsumption;
        this.mileage = mileage;
        this.status = status;
    }

    public Double getRating() {
        rating = rating == null ? 0 : rating;
        return Math.round(rating * 10.0) / 10.0;
    }

    public List<String> getImages() {
        return Arrays.stream(image.split(",")).toList();
    }
}