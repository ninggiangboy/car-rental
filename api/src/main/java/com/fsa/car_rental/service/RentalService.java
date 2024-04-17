package com.fsa.car_rental.service;

import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.rent.BookingListResponse;
import com.fsa.car_rental.dto.rent.RentEditRequest;
import com.fsa.car_rental.dto.rent.RentRequest;
import com.fsa.car_rental.dto.rent.RentResponse;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface RentalService {

    Integer rentCar(RentRequest request, User user);

    void rejectRental(Integer id, User user);

    void confirmRental(Integer id, User user);

    List<Integer> rejectList(Integer id, User user);

    void payDeposit(Integer id, PaymentMethod paymentMethod, User user, String description);

    void cancelRental(Integer id, User user);

    void pickUp(Integer id, User user);

    void payRent(Integer id, PaymentMethod paymentMethod, User user, String description);

    void confirmPayment(Integer id, User user);

    void returnCar(Integer id, User user);

    void editRental(RentEditRequest request, Integer id, User user);

    Page<BookingListResponse> viewMyBookingList(UUID userId, List<RentalStatus> status, String sort, int page, int size);

    RentResponse getRentalInformation(Integer id, User user);

    List<TransactionResponse> getRentalTransaction(Integer id, User user);
}
