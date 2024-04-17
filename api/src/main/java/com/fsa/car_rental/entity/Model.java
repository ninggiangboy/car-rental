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
@Table(name = "models", schema = "car_rental")
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "model_id")
    private Integer id;

    @Column(name = "model_name")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}