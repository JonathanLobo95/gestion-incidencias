package com.gestion.partes.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {
}
