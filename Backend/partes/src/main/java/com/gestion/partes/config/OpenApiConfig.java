package com.gestion.partes.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        final String securityScheme = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                .title(" Api de Gestion de Partes")
                .version("1.0")
                .description("Documentación de la API con seguridad JWT integrada."))

        //Le decimos a Swagger que todas las rutas requieren por defecto autenticación
                .addSecurityItem(new SecurityRequirement().addList(securityScheme))
        //Configuramos el botón de "Authorize" para que acepte tokens JWT
                .components(new Components()
                        .addSecuritySchemes(securityScheme,
                                new SecurityScheme()
                                        .name(securityScheme)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));


    }
    @Bean
    public OpenApiCustomizer globalHeaderCustomizer() {
        return openApi -> openApi.getPaths().values().forEach(pathItem ->
                pathItem.readOperations().forEach(operation ->
                        operation.addParametersItem(new Parameter()
                                .in("header")
                                .name("X-Tenant-ID")
                                .description("Identificador del cliente/inquilino (Tenant)")
                                .required(true)
                                .schema(new io.swagger.v3.oas.models.media.StringSchema().example("default"))
                        )
                )
        );
    }
}
