package com.gestion.partes.controller;

import com.gestion.partes.context.TenantContext;
import com.gestion.partes.dto.IncidentEvent;
import com.gestion.partes.model.Incidencia;
import com.gestion.partes.repository.IncidenciaRepository;
import com.gestion.partes.service.IncidenciaService;
import com.gestion.partes.service.KafkaProducerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@Tag(name = "Incidencias", description = "Gestión de tockets con soporte Multi-tenant y kafka")
public class IncidenciaController {
    private final IncidenciaService service;
    private final KafkaProducerService kafkaProducer;

    //no hace falta el c0onstructor al poner el @ArgsConstruvtor
    public IncidenciaController(IncidenciaService service, KafkaProducerService kafkaProducer) {
        this.service = service;
        this.kafkaProducer = kafkaProducer;
    }




    // Listar todas
@GetMapping
@Operation(summary = "Listar incidencia de la empresa actual")
public List<Incidencia> listar() {
        return service.listarTodas();
}

//crear incidencia
@PostMapping
@Operation(summary = "crear incidencia y disparar evento a Kafka para IA ")
    public Incidencia guardar(@RequestBody Incidencia incidencia) {
    // 1. Capturamos el TenantID del contexto (puesto ahí por el Interceptor)
    String currentTenant = TenantContext.getCurrentTenant();
    incidencia.setTenantId(currentTenant);

    // 2. Guardamos en la base de datos
    Incidencia guardada = service.crearIncidencia(incidencia);

    // 3. Enviamos el evento a Kafka para que la IA lo procese asíncronamente
    IncidentEvent evento = new IncidentEvent(
            guardada.getId(),
            guardada.getTitulo(),
            guardada.getDescripcion(),
            guardada.getTenantId()

            );
    kafkaProducer.sendIncidentEvent(evento);

    return guardada;
}

//obtener por ID
@GetMapping("/{id}")
    public Incidencia obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
}

//eliminar
@DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
}

//actualizar incidencia
@PutMapping("/{id}")
    public Incidencia actualizar(@PathVariable Long id, @RequestBody Incidencia detalles) {
        Incidencia incidencia = service.obtenerPorId(id);
        incidencia.setEstado(detalles.getEstado()); // Solo actualizamos el estado por ahora
        return service.crearIncidencia(incidencia); // save() sirve para actualizar si el ID existe
}

}
