package com.gestion.partes;

import com.gestion.partes.model.Incidencia;
import com.gestion.partes.model.EstadoIncidencia; // Asegúrate de importar tu Enum
import com.gestion.partes.repository.IncidenciaRepository;
import com.gestion.partes.service.IncidenciaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals; // Importante para comparar
import static org.mockito.ArgumentMatchers.any; // El "any" correcto es este
import static org.mockito.Mockito.*; // Esto importa when, verify, times, etc.

@ExtendWith(MockitoExtension.class)
public class IncidenciaServiceTest {

    @Mock
    private IncidenciaRepository incidenciaRepository; // Se llama incidenciaRepository

    @InjectMocks
    private IncidenciaService incidenciaService; // Se llama incidenciaService

    @Test
    public void cuandoSeCreaIncidencia_entoncesSeGuardaComoPendiente() {
        // GIVEN
        Incidencia nueva = new Incidencia();
        nueva.setTitulo("Grifo roto");

        // Usamos el nombre correcto: incidenciaRepository
        when(incidenciaRepository.save(any(Incidencia.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        Incidencia resultado = incidenciaService.crearIncidencia(nueva);

        // THEN
        assertEquals(EstadoIncidencia.PENDIENTE, resultado.getEstado());
        verify(incidenciaRepository, times(1)).save(any());
    }
}