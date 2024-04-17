package com.fsa.car_rental.repository;

import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.rent.BookingListRecord;
import com.fsa.car_rental.entity.Car;
import com.fsa.car_rental.entity.User;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CarRepository extends JpaRepository<Car, Integer>, JpaSpecificationExecutor<Car> {
    @EntityGraph(attributePaths = {"model", "model.brand", "color", "features"})
    <T> Optional<T> findById(Integer id, Class<T> type);


    @Query("SELECT c.createdAt " +
           "FROM Car c JOIN c.carOwner u " +
           "WHERE u.id = :carOwnerId " +
           "ORDER BY c.createdAt LIMIT 1")
    Instant findFirstRide(UUID carOwnerId);

    @Query(value = """
            SELECT AVG(rate.rating) AS avgRating, COUNT(r.rental_id) AS rideCount
            FROM car_rental.cars c
            JOIN
            car_rental.rentals r ON c.car_id = r.car_id JOIN
            car_rental.ratings rate ON r.rental_id = rate.rental_id
            WHERE c.car_id = ?1""", nativeQuery = true)
    Tuple findAvgAndRide(Integer carId);

    @Query(value = """
            SELECT u.full_name, u.image, rate.comment, rate.rating, rate.created_at FROM car_rental.cars c
            JOIN car_rental.rentals r ON r.car_id = c.car_id
            JOIN car_rental.ratings rate ON rate.rental_id = r.rental_id
            JOIN car_rental.users u ON u.user_id = r.renter_id
            WHERE c.car_id = ?1 ORDER BY rate.created_at desc
            """, nativeQuery = true)
    Page<Tuple> getCarRating(Integer carId, Pageable pageable);


    @Query(value = """
            SELECT new com.fsa.car_rental.dto.rent.BookingListRecord(
                r.id,
                u.id,
                u.fullName,
                u.email,
                u.phoneNumber,
                u.image,
                r.rentalStart,
                r.rentalEnd,
                r.totalPrice,
                r.deposit,
                r.rentalStatus,
                r.createdAt,
                r.car.id,
                rr.name,
                rr.phoneNumber,
                rr.nationalId,
                rr.driverLicense,
                rd.name,
                rd.phoneNumber,
                rd.nationalId,
                rd.driverLicense,
                ra.rating,
                ra.comment,
                ra.createdAt
            )
            FROM Rental r
            LEFT JOIN r.car c
            LEFT JOIN r.rating ra
            LEFT JOIN User u on r.renter.id = u.id
            LEFT JOIN RentalPerson rr on r.renterPerson.id = rr.id
            LEFT JOIN RentalPerson rd on r.driver.id = rd.id
            WHERE c.id = :carId
            AND (:status IS NULL OR r.rentalStatus IN :status)
            AND (:rating IS NULL OR ra.rating IN :rating)
            """)
    Page<BookingListRecord> bookingHistory(Integer carId, List<RentalStatus> status, List<Integer> rating, Pageable pageable);

    Optional<Car> findByIdAndCarOwner(Integer id, User user);
}
