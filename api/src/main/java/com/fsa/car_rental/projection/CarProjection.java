package com.fsa.car_rental.projection;

import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import com.fsa.car_rental.entity.Rating;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Projection for {@link com.fsa.car_rental.entity.Car}
 */
public interface CarProjection {
    Integer getId();

    String getLicensePlate();

    Integer getYear();

    Integer getNumberOfSeats();

    Integer getMileage();

    TransmissionType getTransmissionType();

    FuelType getFuelType();

    CarStatus getStatus();

    BigDecimal getFuelConsumption();

    BigDecimal getBasePrice();

    BigDecimal getDeposit();

    String getImages();

    String getDescription();

    String getTermOfUse();

    ModelInfo getModel();

    Set<FeatureInfo> getFeatures();

    ColorInfo getColor();

    LocationInfo getLocation();

    CarOwnerInfo getCarOwner();

    Instant getCreatedAt();


    /**
     * Projection for {@link com.fsa.car_rental.entity.User}
     */
    interface CarOwnerInfo {
        UUID getId();
    }

    /**
     * Projection for {@link com.fsa.car_rental.entity.Model}
     */
    interface ModelInfo {
        String getName();

        BrandInfo getBrand();

        /**
         * Projection for {@link com.fsa.car_rental.entity.Brand}
         */
        interface BrandInfo {
            String getName();
        }
    }

    /**
     * Projection for {@link com.fsa.car_rental.entity.Feature}
     */
    interface FeatureInfo {
        String getName();
    }

    /**
     * Projection for {@link com.fsa.car_rental.entity.Color}
     */
    interface ColorInfo {
        String getName();
    }

    /**
     * Projection for {@link com.fsa.car_rental.entity.Location}
     */
    interface LocationInfo {
        String getId();
    }

    /**
     * Projection for {@link com.fsa.car_rental.entity.Rental}
     */
    interface RentalInfo {
        Integer getId();

        Instant getRentalStart();

        Instant getRentalEnd();

        BigDecimal getTotalPrice();

        Set<Rating> getRatings();

        CarOwnerInfo getCarOwner();
    }
}