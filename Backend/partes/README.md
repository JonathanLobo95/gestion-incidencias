# 🤖 AI-Driven Multi-Tenant Incident Management System

Un sistema robusto y escalable de gestión de incidencias diseñado bajo una arquitectura **Fullstack distributed**. La plataforma está preparada para entornos empresariales mediante aislamiento de datos por inquilinos (**Multi-tenancy**) y optimizada con **procesamiento asíncrono dirigido por eventos** para delegar el análisis inteligente de tickets a un servicio de Inteligencia Artificial mediante **Apache Kafka**.

---

## 🏗️ Arquitectura del Sistema y Flujo de Datos

El flujo de información sigue un ciclo desacoplado y seguro de extremo a extremo:

1. **Frontend (React):** Captura la incidencia y, a través de un interceptor centralizado en Axios, inyecta dinámicamente el `X-Tenant-ID` (empresa activa) y el token `Authorization: Bearer <JWT>` desde el `LocalStorage`.
2. **Seguridad y Filtros (Spring Security):** Valida la procedencia (CORS) y procesa el filtro de autenticación stateless (`JwtAuthenticationFilter`).
3. **Aislamiento (TenantInterceptor):** Captura el ID del inquilino antes de llegar al controlador y lo establece en un `TenantContext` basado en `ThreadLocal` para que Hibernate filtre los datos de forma aislada.
4. **Mensajería Asíncrona (Apache Kafka):** Tras persistir la incidencia, el controlador mapea un `IncidentEvent` hacia un topic de Kafka, permitiendo que un microservicio de IA procese y analice el ticket sin bloquear el hilo principal del usuario.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React, Tailwind CSS, Axios, Vite / Create React App.
* **Backend:** Java, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate Multi-tenancy.
* **Mensajería / Eventos:** Apache Kafka.
* **Base de Datos:** PostgreSQL.
* **Documentación de API:** Swagger UI / OpenAPI 3.

---

## 📸 Documentación y Pruebas de la API (Swagger UI)

La API REST está completamente autodocumentada siguiendo el estándar OpenAPI. A continuación se detallan los principales flujos y endpoints del sistema:

### 1. Registro y Autenticación del Usuario (`/auth/*`)
Permite la creación de usuarios y la generación de tokens JWT efímeros para la comunicación segura con el Frontend.

*(Sustituye esta línea por tu captura de Swagger, por ejemplo: ![Endpoints Auth](./screenshots/swagger-auth.png))*

### 2. Gestión de Incidencias (`/api/incidencias`)
Endpoint protegido que requiere token de autenticación y cabecera de inquilino. Soporta operaciones CRUD completas integradas con Kafka.

*(Sustituye esta línea por tu captura de Swagger, por ejemplo: ![Endpoints Incidencias](./screenshots/swagger-incidencias.png))*

---

## 🚀 Guía de Despliegue en la Nube (URL Pública Gratis)

Para llevar este proyecto del entorno local (`localhost`) a producción y poder compartir una URL pública en tu CV, utilizaremos plataformas Cloud modernas con capas gratuitas adecuadas para desarrolladores.

### 🗄️ Paso 1: La Base de Datos (PostgreSQL)
Desplegaremos la base de datos de producción de forma independiente:
1. Regístrate en **Supabase** o **Render.com**.
2. Crea un nuevo proyecto o una instancia de "PostgreSQL Database".
3. Copia la URI de conexión externa (External Connection String) provista por la plataforma.

### ☕ Paso 2: El Backend (Spring Boot)
Utilizaremos **Render.com** o **Railway.app** para alojar el servidor Java:
1. Sube el código de tu backend a un repositorio en **GitHub**.
2. En Render, crea un nuevo **Web Service** y conéctalo a tu repositorio.
3. Elige el entorno de ejecución **Docker** o configura el comando de construcción nativo:
    * **Build Command:** `./mvnw clean package -DskipTests`
    * **Start Command:** `java -jar target/*.jar`
4. **Variables de Entorno (Crucial):** En la pestaña *Environment*, añade las credenciales de tu base de datos cloud para que Spring no apunte a localhost:
    * `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<HOST_DE_TU_SUPABASE>:5432/<DB_NAME>`
    * `SPRING_DATASOURCE_USERNAME` = `tu_usuario_de_supabase`
    * `SPRING_DATASOURCE_PASSWORD` = `tu_contraseña_de_supabase`

### 🎨 Paso 3: El Frontend (React)
El frontend se desplegará de forma estática y ultrarrápida en **Vercel** o **Netlify**:
1. Antes de subirlo, cambia la `baseURL` de tu archivo `axios.js` para que apunte a la nueva URL pública de Render (ej: `https://tu-backend.onrender.com/api/`).
2. Sube el código del Front a **GitHub**.
3. Inicia sesión en **Vercel**, selecciona "Add New Project" e importa tu repositorio de React.
4. Haz clic en **Deploy**. ¡En menos de un minuto tendrás tu URL pública de la interfaz!

---

## 🔧 Configuración para Desarrollo Local

Si deseas clonar este proyecto en tu máquina local, sigue estos pasos:

1. Clonar el repositorio: `git clone <url-del-repositorio>`
2. Configurar y arrancar tus contenedores locales de **PostgreSQL** y **Apache Kafka** mediante Docker Compose: `docker-compose up -d`
3. Arrancar el Backend en tu IDE (IntelliJ IDEA) o mediante terminal: `./mvnw spring-boot:run`
4. Instalar dependencias del Frontend y arrancar el servidor de desarrollo:
   ```bash
   cd frontend
   npm install
   npm start