package com.gestion.partes.service;

import com.gestion.partes.dto.IncidentEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    // KafkaTemplate es la herramienta que Spring nos da para enviar mensajes
    private final KafkaTemplate<String, IncidentEvent>  kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, IncidentEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendIncidentEvent(IncidentEvent event) {
        kafkaTemplate.send("incidencias-topic", event);
        System.out.println("evento enviado a Kafka: " + event.getTitulo());

    }

}
