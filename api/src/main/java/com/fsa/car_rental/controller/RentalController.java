package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.payment.PaymentMethod;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.rent.BookingListResponse;
import com.fsa.car_rental.dto.rent.RentEditRequest;
import com.fsa.car_rental.dto.rent.RentRequest;
import com.fsa.car_rental.dto.transaction.TransactionResponse;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.RatingService;
import com.fsa.car_rental.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${prefix.api}/rentals")
@RequiredArgsConstructor
public class RentalController extends BaseController {

    private final RentalService rentalService;
    private final RatingService ratingService;

    @RequestMapping("")
    public ResponseEntity<ResultResponse> rentCar(@RequestBody RentRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Integer id = rentalService.rentCar(request, user);
        return buildResponse("Rent successfully", id);
    }

    @RequestMapping("/{id}/confirm-rental")
    public ResponseEntity<ResultResponse> confirmRental(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        rentalService.confirmRental(id, user);
        return buildResponse("Confirm rent successfully");
    }

    @RequestMapping("/{id}/reject-list")
    public ResponseEntity<ResultResponse> getRejectList(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        List<Integer> ids = rentalService.rejectList(id, user);
        return buildResponse("reject list", ids);
    }

    @RequestMapping("/{id}/cancel")
    public ResponseEntity<ResultResponse> cancelRental(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        rentalService.cancelRental(id, user);
        return buildResponse("Cancel rent successfully");
    }

    @RequestMapping("/{id}/reject")
//    @PreAuthorize("hasRole('CAROWNER')")
    public ResponseEntity<ResultResponse> rejectRental(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        rentalService.rejectRental(id, user);
        return buildResponse("Reject rent successfully");
    }

    @RequestMapping("/{id}/pick-up")
    public ResponseEntity<ResultResponse> pickUp(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        rentalService.pickUp(id, user);
        return buildResponse("Successfully");
    }

    @RequestMapping("/{id}/return")
    public ResponseEntity<ResultResponse> returnCar(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        rentalService.returnCar(id, user);
        return buildResponse("Return car successfully");
    }

    @RequestMapping("/{id}")
    public ResponseEntity<ResultResponse> getRentalInformation(@PathVariable Integer id, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var rental = rentalService.getRentalInformation(id, user);
        return buildResponse("Rental information", rental);
    }

    @RequestMapping("/{id}/transactions")
    public ResponseEntity<ResultResponse> viewTransactions(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        List<TransactionResponse> transactions = rentalService.getRentalTransaction(id, user);
        return buildResponse("Transactions", transactions);
    }

    @RequestMapping("/{id}/edit")
    public ResponseEntity<ResultResponse> editRental(
            @RequestBody RentEditRequest request,
            @PathVariable Integer id, Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        rentalService.editRental(request, id, user);
        return buildResponse("Edit rental successfully");
    }

    @GetMapping("/{id}/deposit")
    public ResponseEntity<ResultResponse> payDeposit(
            @PathVariable Integer id,
            @RequestParam(name = "paymentMethod") PaymentMethod paymentMethod,
            Authentication authentication
    ) {
        rentalService.payDeposit(id, paymentMethod, (User) authentication.getPrincipal(), "");
        return buildResponse("Pay deposit successfully");
    }

    @RequestMapping("/{id}/pay-rent")
    public ResponseEntity<ResultResponse> payRent(
            @PathVariable Integer id,
            @RequestParam(name = "paymentMethod") PaymentMethod paymentMethod,
            Authentication authentication
    ) {
        rentalService.payRent(id, paymentMethod, (User) authentication.getPrincipal(), "");
        return buildResponse("Pay rent successfully");
    }

    @RequestMapping("/{id}/complete")
    public ResponseEntity<ResultResponse> complete(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        rentalService.confirmPayment(id, user);
        return buildResponse("Rental completed successfully");
    }

    @GetMapping("")
    public ResponseEntity<ResultResponse> viewMyBookings(
            Authentication authentication,
            @RequestParam(required = false) List<RentalStatus> status,
            @RequestParam(required = false, name = "page", defaultValue = "1") int page,
            @RequestParam(required = false, name = "perPage", defaultValue = "8") int size,
            @RequestParam(required = false, name = "sort", defaultValue = "desc") String sort
    ) {
        User user = (User) authentication.getPrincipal();
        if (status != null && status.contains(RentalStatus.PENDING)) {
            status.addAll(List.of(RentalStatus.PENDING_DEPOSIT, RentalStatus.PENDING_PICKUP, RentalStatus.PENDING_PAYMENT));
        }
        Page<BookingListResponse> bookings = rentalService.viewMyBookingList(user.getId(), status, sort, page, size);
        return buildResponse("My Booking List ", bookings);
    }

    @RequestMapping("/{id}/ratings")
    public ResponseEntity<ResultResponse> giveRating(
            @PathVariable Integer id,
            @RequestParam Integer rate,
            @RequestParam String comment
    ) {
        ratingService.giveRating(id, rate, comment);
        return buildResponse("Rating added successfully");
    }

}
