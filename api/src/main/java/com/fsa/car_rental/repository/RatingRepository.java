package com.fsa.car_rental.repository;

import com.fsa.car_rental.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Rating findByRentalId(Integer rentalId);
}
