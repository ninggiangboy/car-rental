package com.fsa.car_rental.entity;

import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cars", schema = "car_rental")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Integer id;

    @Column(name = "license_plate")
    private String licensePlate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "car_features", schema = "car_rental",
            joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> features;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private Set<Rental> rentals;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private Color color;

    @Column(name = "car_year")
    private Integer year;

    @Column(name = "number_of_seats")
    private Integer numberOfSeats;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "transmission_type")
    @Enumerated(EnumType.STRING)
    private TransmissionType transmissionType;

    @Column(name = "fuel_type")
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Column(name = "car_status")
    @Enumerated(EnumType.STRING)
    private CarStatus status;

    @Column(name = "fuel_consumption")
    private BigDecimal fuelConsumption;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "deposit")
    private BigDecimal deposit;

    @Column(name = "car_image")
    private String images;

    @Column(name = "car_description")
    private String description;

    @Column(name = "term_of_use")
    private String termOfUse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_owner_id")
    private User carOwner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "car", cascade = CascadeType.ALL)
    private Set<CarAvailableDate> carAvailableDates;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}