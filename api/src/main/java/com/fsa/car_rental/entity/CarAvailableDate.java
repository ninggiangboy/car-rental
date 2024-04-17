package com.fsa.car_rental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.time.Instant;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "car_available_dates", schema = "car_rental")
public class CarAvailableDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "available_date_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

}