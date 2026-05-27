package com.gestion.partes.config;

import com.gestion.partes.context.TenantInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private TenantInterceptor tenantInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tenantInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/v3/api-docs/**",      // Datos crudos de OpenAPI
                        "/swagger-ui/**",       // Interfaz gráfica de Swagger
                        "/swagger-ui.html",     // Redirección principal de Swagger
                        "/favicon.ico"          // Evita bloqueos por el icono del navegador
                );
    }
}
