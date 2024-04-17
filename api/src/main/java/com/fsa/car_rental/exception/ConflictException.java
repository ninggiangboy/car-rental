package com.fsa.car_rental.exception;

public class ConflictException extends ClientErrorException {

    public ConflictException(String message) {
        super(message);
    }
}
