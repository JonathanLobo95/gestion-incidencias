package com.gestion.partes.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisIAService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    public String clasificarPrioridad(String texto) {
        RestTemplate restTemplate = new RestTemplate();

        //configuramos los headers con el token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        // Definimos las categorías que la IA debe evaluar
        Map<String, Object> body = new HashMap<>();
        body.put("inputs", texto);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("candidate_labels", Arrays.asList("URGENTE", "MANTENIMIENTO", "PENDIENTE"));
        body.put("parameters", parameters);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try{
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl,entity,Map.class);
            // La IA devuelve una lista de etiquetas ordenadas por probabilidad
            List<String> labels = (List<String>) response.getBody().get("labels");
            return labels.get(0).toUpperCase();
        } catch (Exception e){
            //devolvemos un valor por sio falla la IA
            return "PENDIENTE";
        }

    }
}
