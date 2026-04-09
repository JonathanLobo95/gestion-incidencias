package com.gestion.partes.service;

import com.gestion.partes.model.EstadoIncidencia;
import com.gestion.partes.model.Incidencia;
import com.gestion.partes.repository.IncidenciaRepository;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidenciaService {

    private final IncidenciaRepository repository;
    public IncidenciaService(IncidenciaRepository incidenciaRepository) {
        this.repository = incidenciaRepository;
    }

    @Enumerated(EnumType.STRING)
    private EstadoIncidencia estado;

    //Método para crear una nueva incidencia
    public Incidencia crearIncidencia (Incidencia incidencia){
        incidencia.setEstado(EstadoIncidencia.PENDIENTE);
        incidencia.setFechaCreacion(LocalDateTime.now());
        return repository.save(incidencia);
    }
    //Método para obtener todas las incidencias
    public List<Incidencia> listarTodas(){
        return repository.findAll();
    }

    //Método para obtener por id
    public Incidencia obtenerPorId(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada con ID: " + id));
    }

    //Método para eliminar la incidencia
    public void eliminar(Long id) {
        //ssi existe eliminamos
        if  (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Incidencia no encontrada con ID: " + id);
        }

    }
}
