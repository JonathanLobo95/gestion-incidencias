
package com.gestion.partes.service;

import com.gestion.partes.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service; // ¡IMPORTANTE!

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service // 1. CORREGIDO: Añadida la anotación para que Spring la detecte
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.key.expiration}")
    private Long jwtexpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private Long refreshtokenexpiration;

    public String extractUsername(final String token){
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(final String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token) // 2. CORREGIDO: parseSignedClaims (sin 'r')
                .getPayload();
    }

    public String generateToken(final User user){
        return buildToken(user, jwtexpiration);
    }

    public String generateRefreshToken(final User user){
        return buildToken(user, refreshtokenexpiration);
    }

    private String buildToken(final User user, final Long expiration) { // 3. CORREGIDO: Renombrado a expiration
        return Jwts.builder()
                .id(user.getId().toString()) // 4. CORREGIDO: getId() con I mayúscula
                .claims(Map.of("name", user.getName()))
                .subject(user.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    // 5. SOLUCIÓN AL ERROR: Dejamos el método público para que AuthService lo vea
    public boolean isTokenValid(final String token, final User user){
        final String username = extractUsername(token);
        return (username.equals(user.getEmail())) && !isTokenExpired(token);
    }

    // 6. SOBRECARGA: Añadimos este método para que el JwtAuthenticationFilter también funcione usando UserDetails
    public boolean isTokenValid(final String token, final UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(final String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(final String token){
        return extractAllClaims(token).getExpiration();
    }

    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
