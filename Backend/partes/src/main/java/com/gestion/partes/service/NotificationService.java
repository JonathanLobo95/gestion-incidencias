package com.gestion.partes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailUrgente(Long id, String titulo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        // Aquí iría el correo del responsable
        mensaje.setTo("tecnico-guardia@empresa.com");
        mensaje.setSubject("🚨 ALERTA: Incidencia Crítica detectada por IA");
        mensaje.setText("La IA ha clasificado la incidencia #" + id + " como URGENTE.\n\n" +
                "Título: " + titulo + "\n" +
                "Por favor, revisa el sistema de gestión de partes.");

        mailSender.send(mensaje);
        System.out.println("📧 Correo de urgencia enviado para la incidencia: " + id);
    }
}
