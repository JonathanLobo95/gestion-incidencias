import axios from 'axios';

// 1. Creamos la instancia centralizada con la URL base de tu Spring Boot
/*const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
});
*/
// 1. Creamos la instancia centralizada. 
// Si está en Vercel, usará la variable de entorno de producción.
// Si estás en tu computadora, usará el localhost:8080 por defecto.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/',
});

// 2. Interceptor mágico: antes de que salga CUALQUIER petición hacia el backend,
// este código se ejecuta automáticamente para pegarle el Tenant ID.
api.interceptors.request.use((config) => {
    // Busca en la memoria del navegador si hay una empresa seleccionada.
    // Si no encuentra ninguna, pone 'empresa-por-defecto' para que no rompa.
    const tenantId = localStorage.getItem('tenantId') || 'empresa-por-defecto';

    // Le inyectamos la cabecera HTTP que tu TenantInterceptor de Spring está esperando
    config.headers['X-Tenant-ID'] = tenantId;

    const token = localStorage.getItem('accessToken');
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }else {
        console.warn("⚠️ No se encontró ningún 'accessToken' en el LocalStorage. La petición podría fallar con 403.");
    }
    

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;