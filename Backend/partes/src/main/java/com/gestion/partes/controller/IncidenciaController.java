package com.gestion.partes.controller;

import com.gestion.partes.model.Incidencia;
import com.gestion.partes.repository.IncidenciaRepository;
import com.gestion.partes.service.IncidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@CrossOrigin(origins= "http://localhost:5173") // para conectar con React
public class IncidenciaController {
    private final IncidenciaService service;

    public IncidenciaController(IncidenciaService service) {
        this.service = service;
    }

    // Listar todas
@GetMapping
public List<Incidencia> listar() {
        return service.listarTodas();
}

//crear incidencia
@PostMapping
    public Incidencia guardar(@RequestBody Incidencia incidencia) {
        return service.crearIncidencia(incidencia);
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
