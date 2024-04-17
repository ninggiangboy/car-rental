package com.fsa.car_rental.service;

import com.fsa.car_rental.entity.Rating;

public interface RatingService {
    void giveRating(Integer id, Integer rate, String comment);

    Rating getRatingByRentalId(Integer rentalId);
}
