package com.gestion.partes.context;

public class TenantContext {

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    //aqui guardamos el ID de la empresa
    public static void setCurrentTenant(String tenantid) {
        CURRENT_TENANT.set(tenantid);
    }
    //devolvemos el ID de la empresa
    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }
    //Limpiamos el ID
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
