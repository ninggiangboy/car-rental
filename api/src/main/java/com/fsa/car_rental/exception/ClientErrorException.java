package com.fsa.car_rental.exception;

public class ClientErrorException extends RuntimeException {

    public ClientErrorException(String message) {
        super(message);
    }
}
