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
@Table(name = "colors", schema = "car_rental")
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id")
    private Integer id;

    @Column(name = "color_name")
    private String name;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}