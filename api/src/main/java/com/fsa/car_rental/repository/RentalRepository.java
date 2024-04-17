package com.fsa.car_rental.repository;

import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.rent.BookingListResponse;
import com.fsa.car_rental.entity.Rental;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RentalRepository extends JpaRepository<Rental, Integer> {

    @Query(value = """
                SELECT r.id
                FROM Rental r
                WHERE r.rentalStatus = :status
                AND r.car.id = :carId
                AND ((r.rentalStart >= :start AND r.rentalStart <= :end)
                OR (r.rentalEnd >= :start AND r.rentalEnd <= :end)
                OR (:start >= r.rentalStart AND :end <= r.rentalEnd))
            """)
    List<Integer> findIdAllByCarIdAndStartAndEndAndStatus(Integer carId, Instant start, Instant end,
                                                          RentalStatus status);

    List<Rental> findByCarId(Integer carId);

    @Query(value = """
            SELECT new com.fsa.car_rental.dto.rent.BookingListResponse(
                r.id,
                r.rentalStart,
                r.rentalEnd,
                r.totalPrice,
                r.deposit,
                r.rentalStatus,
                r.createdAt,
                r.car.id,
                c.images,
                NULL,
                b.name,
                m.name,
                c.year,
                ra.rating,
                ra.comment,
                ra.createdAt
            )
            FROM Rental r
            LEFT JOIN r.car c
            LEFT JOIN c.model m
            LEFT JOIN m.brand b
            LEFT JOIN r.rating ra
            WHERE r.renter.id = :userId
            AND (:status IS NULL OR r.rentalStatus IN :status)
            """)
    Page<BookingListResponse> findByRenterId(UUID userId, List<RentalStatus> status, Pageable pageable);

    @Query(value = """
               WITH cte_monthly_revenue AS (
                SELECT
                    DATE_TRUNC('month', r.rental_end) AS month,
                    SUM(r.total_price) AS totalBasePrice
                FROM
                    car_rental.rentals r
                    LEFT JOIN car_rental.cars c ON c.car_id = r.car_id
                    LEFT JOIN car_rental.users u ON u.user_id = c.car_owner_id
                WHERE
                c.car_owner_id = :userId AND
                    r.rental_status = 'COMPLETED'
                GROUP BY
                    DATE_TRUNC('month', r.rental_end)
                ORDER BY
                    month DESC
                LIMIT 2
            ),
            cte_monthly_revenue_with_row_number AS (
                SELECT
                    totalBasePrice,
                    ROW_NUMBER() OVER (ORDER BY month DESC) AS row_number
                FROM
                    cte_monthly_revenue
            ),
            cte_total_base_price_and_avg_rating AS (
                SELECT
                    SUM(r.total_price) AS totalBasePrice,
                    ROUND(AVG(rate.rating), 2) AS avgRating
                FROM
                    car_rental.rentals r
                    LEFT JOIN car_rental.cars c ON c.car_id = r.car_id
                    LEFT JOIN car_rental.users u ON u.user_id = c.car_owner_id
                    LEFT JOIN car_rental.ratings rate ON rate.rental_id = r.rental_id
                WHERE
                    c.car_owner_id = :userId
                    AND r.rental_status = 'COMPLETED'
            ),
            cte_total_rides AS (
                SELECT
                    COUNT(*) AS totalRides
                FROM
                    car_rental.rentals r
                WHERE
                    r.rental_status = 'COMPLETED'
            )
            SELECT
                (SELECT totalBasePrice FROM cte_monthly_revenue_with_row_number WHERE row_number = 1) AS currentMonthRevenue,
                (SELECT totalBasePrice FROM cte_monthly_revenue_with_row_number WHERE row_number = 2) AS previousMonthRevenue,
                totalBasePrice AS totalBasePriceAllTime,
                avgRating AS avgRatingAllTime,
                (SELECT totalRides FROM cte_total_rides) AS totalRides
            FROM
                cte_total_base_price_and_avg_rating;
            """, nativeQuery = true)
    Tuple findAllRentalInfo(UUID userId);

    @Query(value = """
                       WITH cte_monthly_revenue AS (
                SELECT
                    DATE_TRUNC('month', r.rental_end) AS month,
                    SUM(r.total_price) AS totalBasePrice
                FROM
                    car_rental.rentals r
                    LEFT JOIN car_rental.cars c ON c.car_id = r.car_id
                    LEFT JOIN car_rental.users u ON u.user_id = c.car_owner_id
                WHERE
                c.car_owner_id = :userId AND
                c.car_id = :id AND
                    r.rental_status = 'COMPLETED'
                GROUP BY
                    DATE_TRUNC('month', r.rental_end)
                ORDER BY
                    month DESC
                LIMIT 2
            ),
            cte_monthly_revenue_with_row_number AS (
                SELECT
                    totalBasePrice,
                    ROW_NUMBER() OVER (ORDER BY month DESC) AS row_number
                FROM
                    cte_monthly_revenue
            ),
            cte_total_base_price_and_avg_rating AS (
                SELECT
                    SUM(r.total_price) AS totalBasePrice,
                    ROUND(AVG(rate.rating), 2) AS avgRating
                FROM
                    car_rental.rentals r
                    LEFT JOIN car_rental.cars c ON c.car_id = r.car_id
                    LEFT JOIN car_rental.users u ON u.user_id = c.car_owner_id
                    LEFT JOIN car_rental.ratings rate ON rate.rental_id = r.rental_id
                WHERE
                    c.car_owner_id = :userId AND
                    c.car_id = :id
                    AND r.rental_status = 'COMPLETED'
            ),
            cte_total_rides AS (
                SELECT
                    COUNT(*) AS totalRides
                FROM
                    car_rental.rentals r
                    LEFT JOIN car_rental.cars c ON c.car_id = r.car_id
                WHERE
                    r.rental_status = 'COMPLETED' AND
                    c.car_id = :id
            )
            SELECT
                (SELECT totalBasePrice FROM cte_monthly_revenue_with_row_number WHERE row_number = 1) AS currentMonthRevenue,
                (SELECT totalBasePrice FROM cte_monthly_revenue_with_row_number WHERE row_number = 2) AS previousMonthRevenue,
                totalBasePrice AS totalBasePriceAllTime,
                avgRating AS avgRatingAllTime,
                (SELECT totalRides FROM cte_total_rides) AS totalRides
            FROM
                cte_total_base_price_and_avg_rating;
            """, nativeQuery = true)
    Tuple findCarRentalInfo(UUID userId, Integer id);

    @Query("select r from Rental r where r.id = ?1 and (r.renter.id = ?2 or r.car.carOwner.id = ?2)")
    Optional<Rental> findByIdAndRenter_Id(Integer id, UUID userId);

    @Query("select r.car.id from Rental r where r.renter.id = ?1 and r.rentalStatus = 'COMPLETED' order by r.createdAt desc limit 10")
    List<Integer> findCarIdsByRenter_Id(UUID userId);

    @Query("""
                SELECT r.car.id, r.id, CONCAT(b.name, ' ', m.name, ' ', c.year) AS carName,
                       c.images AS carImage, r.lastModifiedAt, r.rentalStart, r.rentalEnd, r.rentalStatus,
                       (CASE WHEN r.rentalStatus = 'PENDING'
                             THEN (SELECT COUNT(r2) FROM Rental r2
                                   WHERE r2.car.id = r.car.id AND r2.rentalStatus = 'PENDING')
                             ELSE 0
                        END) AS numberOfRent
                FROM Rental r
                LEFT JOIN r.car c
                LEFT JOIN c.model m
                LEFT JOIN m.brand b
                WHERE r.rentalStatus != 'COMPLETED' AND r.rentalStatus != 'CANCELLED' and r.rentalStatus != 'REJECTED' 
                AND r.car.carOwner.id = :ownerId
                AND (r.rentalStatus != 'PENDING' OR r.id = (
                    SELECT r4.id
                    FROM Rental r4
                    WHERE r4.car.id = r.car.id AND r4.rentalStatus = 'PENDING'
                    ORDER BY r4.lastModifiedAt DESC
                    LIMIT 1
                ))
                ORDER BY
                    r.lastModifiedAt DESC
            """)
    List<Tuple> findRecentRent(UUID ownerId);
}
