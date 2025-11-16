package com.example.common.exceptions;

public class DrugNotFoundException extends RuntimeException {

    public DrugNotFoundException(String message) {
        super(message);
    }
}
