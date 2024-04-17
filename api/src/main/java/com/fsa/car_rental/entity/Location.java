package com.fsa.car_rental.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "locations", schema = "car_rental")
public class Location {
    @Id
    @Column(name = "location_id")
    private String id;

    @Column(name = "location_name")
    private String name;

    @Column(name = "location_level")
    private Integer level;

    @Column(name = "left_index")
    private Integer leftIndex;

    @Column(name = "right_index")
    private Integer rightIndex;

    @Column(name = "slug")
    private String slug;

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}