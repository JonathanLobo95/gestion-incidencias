package com.gestion.partes.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {
}
