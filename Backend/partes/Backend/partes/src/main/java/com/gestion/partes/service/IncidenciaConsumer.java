package com.gestion.partes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestion.partes.dto.IncidentEvent;
import com.gestion.partes.model.EstadoIncidencia;
import com.gestion.partes.model.Incidencia;
import com.gestion.partes.repository.IncidenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.gestion.partes.dto.IncidentEvent;

@Service
public class IncidenciaConsumer {
    @Autowired
    private IncidenciaRepository repository;

    @Autowired
    private AnalisisIAService iaService;

    @Autowired
    private NotificationService notificationService;
    //Para leer el JSON der kafka
    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "incidencias-topic", groupId = "grupo-analisis-ia")
    public void procesarIncidencia (IncidentEvent evento) {
        try{

            Long id = evento.getId();
            String titulo = evento.getTitulo();

            System.out.println("🤖 IA analizando incidencia ID: " + id);

            // 2. Llamada a la IA de Hugging Face
            final String prioridad = iaService.clasificarPrioridad(titulo);
            System.out.println("🔍 Resultado IA: " + prioridad);

            //actualizamos la bbdd
            repository.findById(id).ifPresent(incidencia -> {
                try {
                    incidencia.setEstado(EstadoIncidencia.valueOf(prioridad));
                } catch (IllegalArgumentException e) {
                    // Si la IA devuelve algo que no está en el Enum, ponemos uno por defecto
                    incidencia.setEstado(EstadoIncidencia.PROCESADA_POR_IA);
                }
                repository.save(incidencia);
                System.out.println("✅ Incidencia actualizada con Enum: " + incidencia.getEstado());

                //aqui vamos a integrar el sistema de mensajes
                if(incidencia.getEstado()== EstadoIncidencia.URGENTE) {
                    notificationService.enviarEmailUrgente(id, titulo);
                }
            });
        }catch (Exception e) {
            System.err.println("Error procesando evento: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
