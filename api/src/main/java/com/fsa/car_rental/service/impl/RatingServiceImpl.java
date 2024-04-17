package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.entity.Rating;
import com.fsa.car_rental.entity.Rental;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.RatingRepository;
import com.fsa.car_rental.repository.RentalRepository;
import com.fsa.car_rental.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RentalRepository rentalRepository;

    @Override
    public Rating getRatingByRentalId(Integer rentalId) {
        return ratingRepository.findByRentalId(rentalId);
    }

    @Override
    public void giveRating(Integer rentalId, Integer rate, String comment) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new NotFoundException("Rental not found"));

        Rating rating = new Rating();
        rating.setRating(rate);
        rating.setComment(comment);
        rating.setCreatedAt(Instant.now());
        rating.setRental(rental);

        ratingRepository.save(rating);
    }
}
