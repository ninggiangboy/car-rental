package com.fsa.car_rental.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "rental_person", schema = "car_rental")
public class RentalPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "name", nullable = false, length = Integer.MAX_VALUE)
    private String name;

    @NotNull
    @Column(name = "phone", nullable = false, length = Integer.MAX_VALUE)
    private String phoneNumber;

    @NotNull
    @Column(name = "national_id", nullable = false, length = Integer.MAX_VALUE)
    private String nationalId;

    @Column(name = "license_driver", length = Integer.MAX_VALUE)
    private String driverLicense;
}