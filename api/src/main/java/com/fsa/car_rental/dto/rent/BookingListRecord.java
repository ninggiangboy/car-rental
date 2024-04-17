package com.fsa.car_rental.dto.rent;

import com.fsa.car_rental.constant.rental.RentalStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingListRecord {
    //avatar va ten nguoi thue xe
    private Integer id;
    private UserInfo user;
    private Instant rentalStart;
    private Instant rentalEnd;
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private RentalStatus rentalStatus;
    private Instant createdAt;
    private Integer carId;
    private RentInfo renter;
    private RentInfo driver;
    private Integer rate;
    private String comment;
    private Instant ratingTime;

    public BookingListRecord(
            Integer id,
            UUID userId,
            String userFullName,
            String userEmail,
            String userPhoneNumber,
            String userImage,
            Instant rentalStart,
            Instant rentalEnd,
            BigDecimal totalPrice,
            BigDecimal deposit,
            RentalStatus rentalStatus,
            Instant createdAt,
            Integer carId,
            String renterName,
            String renterPhone,
            String renterNationalId,
            String renterDriverLicense,
            String driverName,
            String driverPhone,
            String driverNationalId,
            String driverDriverLicense,
            Integer rate,
            String comment,
            Instant ratingTime) {
        this.id = id;
        this.user = UserInfo.builder()
                .id(userId)
                .phoneNumber(userPhoneNumber)
                .name(userFullName)
                .email(userEmail)
                .image(userImage)
                .build();
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.totalPrice = totalPrice;
        this.deposit = deposit;
        this.rentalStatus = rentalStatus;
        this.createdAt = createdAt;
        this.carId = carId;
        this.renter = RentInfo.builder()
                .name(renterName)
                .phoneNumber(renterPhone)
                .nationalId(renterNationalId)
                .driverLicense(renterDriverLicense)
                .build();
        this.driver = RentInfo.builder()
                .name(driverName)
                .phoneNumber(driverPhone)
                .nationalId(driverNationalId)
                .driverLicense(driverDriverLicense)
                .build();
        this.rate = rate;
        this.comment = comment;
        this.ratingTime = ratingTime;
    }
}
