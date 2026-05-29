package com.gestion.partes.context;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Buscamos el ID de la empresa en la cabnecera x-tenanr-ID
        String tenantId = request.getHeader("X-Tenant-ID");

        if (tenantId == null || tenantId.isEmpty()){
            //log para ver si falla
            System.out.println("❌ Bloqueado por Interceptor: Falta cabecera X-Tenant-ID");
            //si no envia el tenant devolvemos un 400 (bad request)
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }

        //para que el resto de la app de incidendias lo use

        TenantContext.setCurrentTenant(tenantId);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }
}
