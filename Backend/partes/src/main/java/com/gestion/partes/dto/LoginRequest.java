package com.gestion.partes.dto;

public record LoginRequest(
        String email,
        String password
) {
}
