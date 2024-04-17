package com.fsa.car_rental.entity;

import com.fsa.car_rental.constant.rental.RentalStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.time.Instant;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "rentals", schema = "car_rental")
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renter_id")
    private User renter;

    @Column(name = "rental_start")
    private Instant rentalStart;

    @Column(name = "rental_end")
    private Instant rentalEnd;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "deposit")
    private BigDecimal deposit;

    @Column(name = "rental_status")
    @Enumerated(EnumType.STRING)
    private RentalStatus rentalStatus;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "last_modified_at")
    private Instant lastModifiedAt;

    @OneToOne(mappedBy = "rental")
    private Rating rating;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "driver")
    private RentalPerson driver;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "renter")
    private RentalPerson renterPerson;
}