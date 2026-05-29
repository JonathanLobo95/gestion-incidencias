package com.gestion.partes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentEvent {
    private Long id;
    private String titulo;
    private String descripcion;
    private String tenantId;
}
