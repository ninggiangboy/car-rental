package com.fsa.car_rental.repository;

import com.fsa.car_rental.entity.CarAvailableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface CarAvailableDateRepository extends JpaRepository<CarAvailableDate, Integer> {

    Optional<CarAvailableDate> findByCarIdAndStartDateBeforeAndEndDateAfter(
            Integer carId, Instant startDate, Instant endDate
    );

    @Query(value = """
                SELECT c.car.id
                FROM CarAvailableDate c
                WHERE c.startDate <= :startDate AND c.endDate >= :endDate
            """)
    List<Integer> findCarIdByStartDateBeforeAndEndDateAfter(Instant startDate, Instant endDate);

    Optional<CarAvailableDate> findByCarIdAndStartDate(Integer carId, Instant startDate);

    Optional<CarAvailableDate> findByCarIdAndEndDate(Integer carId, Instant startDate);

    List<CarAvailableDate> findByCarId(Integer carId);

    long deleteByEndDateBefore(Instant endDate);
}
