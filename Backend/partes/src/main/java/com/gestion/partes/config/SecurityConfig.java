package com.gestion.partes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desactivamos CSRF (necesario para probar POST/DELETE sin tokens)
                .csrf(csrf -> csrf.disable())

                // 2. Configuramos qué rutas son libres y cuáles no
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/incidencias/**").permitAll() // Tu API es libre
                        .anyRequest().authenticated()                      // El resto necesita login
                )

                // 3. Mantenemos el login por defecto por si quieres entrar desde el navegador
                .formLogin(withDefaults())
                .httpBasic(withDefaults());

        return http.build();
    }

    // 4. Configuración global de CORS para que React (puerto 5173) no sea bloqueado
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
