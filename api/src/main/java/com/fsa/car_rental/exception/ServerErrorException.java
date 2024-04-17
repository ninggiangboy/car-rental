package com.fsa.car_rental.exception;

public class ServerErrorException extends RuntimeException {

    public ServerErrorException(String message) {
        super(message);
    }
}
