package com.fsa.car_rental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "features", schema = "car_rental")
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feature_id")
    private Integer id;

    @Column(name = "feature_name")
    private String name;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}