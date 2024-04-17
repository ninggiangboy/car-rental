package com.fsa.car_rental.repository;

import com.fsa.car_rental.dto.rent.FullUserRentalInfo;
import com.fsa.car_rental.dto.rent.ShortUserRentalInfo;
import com.fsa.car_rental.entity.User;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


/**
 * This interface provides methods for interacting with the database table that stores user information.
 * The methods in this interface are used to perform create, read, update, and delete (CRUD) operations on the user data.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Checks if a user with the given email exists in the database.
     *
     * @param email the email of the user
     * @return true if a user with the given email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Finds a user with the given email in the database.
     *
     * @param email the email of the user
     * @return the user with the given email, if it exists, otherwise returns an empty optional
     */
    Optional<User> findByEmail(String email);

    @Query(value = """
            SELECT ROUND(AVG(rate.rating), 1) AS overall_average_rating, COUNT(r.*)
             FROM car_rental.cars c JOIN car_rental.rentals r ON c.car_id = r.car_id
             JOIN car_rental.ratings rate ON r.rental_id = rate.rental_id
             WHERE c.car_owner_id = ?1 and r.rental_status = 'COMPLETED'
             """, nativeQuery = true)
    Tuple findAvgAndRideByOwnerId(UUID carOwnerId);

    @Query(value = """
            SELECT new com.fsa.car_rental.dto.rent.ShortUserRentalInfo(
                u.id,
                COUNT(r.id),
                COUNT(CASE WHEN r.rentalStatus = 'COMPLETED' THEN r.id END),
                MAX(CASE WHEN r.rentalStatus = 'COMPLETED' THEN r.rentalEnd END),
                1
            ) FROM User u
            LEFT JOIN Rental r on u.id = r.renter.id
            WHERE u.id = :id AND (r.rentalStatus = 'CANCELLED' OR r.rentalStatus = 'COMPLETED')
            GROUP BY u.id
            """)
    ShortUserRentalInfo getUserRentInfo(UUID id);

    @Query(value = """
            SELECT new com.fsa.car_rental.dto.rent.FullUserRentalInfo(
                u.id,
                u.fullName,
                u.email,
                u.phoneNumber,
                u.image,
                u.dateOfBirth,
                COUNT(r.id),
                COUNT(CASE WHEN r.rentalStatus = 'COMPLETED' THEN r.id END),
                MAX(CASE WHEN r.rentalStatus = 'COMPLETED' THEN r.rentalEnd END),
                1
            ) FROM User u
            LEFT JOIN Rental r on u.id = r.renter.id
            WHERE u.id = :id AND (r.rentalStatus = 'CANCELLED' OR r.rentalStatus = 'COMPLETED')
            GROUP BY u.id
            """)
    FullUserRentalInfo getFullUserRentInfo(UUID id);

//    @Query(value = """
//        SELECT new com.fsa.car_rental.dto.rent.BookingRecordProfile(
//               u.fullName,
//               u.phoneNumber,
//               u.dateOfBirth,
//               u.driverLicense,
//               COUNT(r)
//        )
//        FROM User u
//        LEFT JOIN Rental r on u.id = r.renter.id
//        LEFT JOIN Car c on r.car.id = c.id
//        WHERE u.id = :userId and r.rentalStatus = 'COMPLETED'
//        GROUP BY u.fullName, u.phoneNumber, u.dateOfBirth, u.driverLicense
//        """)
//    BookingRecordProfile getBookingProfile(UUID userId);
}
