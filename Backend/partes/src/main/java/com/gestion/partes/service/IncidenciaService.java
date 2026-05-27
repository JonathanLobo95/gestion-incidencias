package com.gestion.partes.service;

import com.gestion.partes.context.TenantContext;
import com.gestion.partes.exception.ResourceNotFoundException;
import com.gestion.partes.exception.TenantValidationException;
import com.gestion.partes.model.EstadoIncidencia;
import com.gestion.partes.model.Incidencia;
import com.gestion.partes.repository.IncidenciaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.hibernate.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class IncidenciaService {

    private final IncidenciaRepository repository;
    private final EntityManager entityManager;
    public IncidenciaService(IncidenciaRepository incidenciaRepository, EntityManager entityManager) {
        this.repository = incidenciaRepository;
        this.entityManager = entityManager;
    }


    //Método para crear una nueva incidencia
    public Incidencia crearIncidencia (Incidencia incidencia){
        System.out.println("recibiendo incidencia para el tenant" + incidencia.getTenantId());

        incidencia.setEstado(EstadoIncidencia.PENDIENTE);
        incidencia.setFechaCreacion(LocalDateTime.now());

        if(incidencia.getEstado()== null) {
            incidencia.setEstado(EstadoIncidencia.PENDIENTE);
        }

        if(incidencia.getFechaCreacion() == null) {
            incidencia.setFechaCreacion(LocalDateTime.now());
        }

        // if por si el tennat viene nulo
        if(incidencia.getTenantId() == null){
            throw new TenantValidationException("Error: el TenantId es obligatorio");
        }
        return repository.save(incidencia);
    }
    //Método para obtener todas las incidencias
    public List<Incidencia> listarTodas(){
        //Desenvolvemos la sesión nativa de Hibernate
        Session session = entityManager.unwrap(Session.class);

        //Recuperamos la empresa quie hizo la peticion HTTP desde el context
        String currentTenant = TenantContext.getCurrentTenant();

        //Activamos el filtro inyectando el ID de la empresa en la query en tiempo de ejecución
        if(currentTenant != null) {
            session.enableFilter("tenantFilter").setParameter("tenantId", currentTenant);
        }
        return repository.findAll();



    }

    //Método para obtener por id
    public Incidencia obtenerPorId(Long id){
        Session session = entityManager.unwrap(Session.class);
        String currentTenant = TenantContext.getCurrentTenant();
        if(currentTenant != null) {
            session.enableFilter("tenantFilter").setParameter("tenantId", currentTenant);
        }
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada"));
    }

    //Método para eliminar la incidencia
    public void eliminar(Long id) {
        // Buscamos primero usando el filtro activo para evitar que un Tenant elimine datos de otro pasándole un ID aleatorio
        Incidencia incidencia = obtenerPorId(id);
        repository.delete(incidencia);
    }

}

