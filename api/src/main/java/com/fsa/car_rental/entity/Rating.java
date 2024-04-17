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
@Table(name = "ratings", schema = "car_rental")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id")
    private Rental rental;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment")
    private String comment;

    @Column(name = "created_at")
    private Instant createdAt;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}