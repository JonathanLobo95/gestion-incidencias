package com.gestion.partes.exception;

public class TenantValidationException extends RuntimeException {
    public TenantValidationException(String message) {
        super(message);
    }
}
