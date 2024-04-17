package com.fsa.car_rental.dto.rent;

import com.fsa.car_rental.constant.rental.RentalStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingListResponse {
    private Integer id;
    private Instant rentalStart;
    private Instant rentalEnd;
    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private RentalStatus rentalStatus;
    private Instant createdAt;
    private Integer carId;
    @Getter(AccessLevel.NONE)
    private String image;
    private List<String> images;
    @Getter(AccessLevel.NONE)
    private String brandName;
    @Getter(AccessLevel.NONE)
    private String modelName;
    @Getter(AccessLevel.NONE)
    private Integer year;
    private Integer rate;
    private String comment;
    private Instant ratingTime;

    public List<String> getImages() {
        return Arrays.stream(image.split(",")).toList();
    }

    public String getCarName() {
        return brandName + " " + modelName + " " + year;
    }
}

