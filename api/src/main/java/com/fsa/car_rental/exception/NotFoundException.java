package com.fsa.car_rental.exception;

public class NotFoundException extends ClientErrorException {

    public NotFoundException(String message) {
        super(message);
    }
}
