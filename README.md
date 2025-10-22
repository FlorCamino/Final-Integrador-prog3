# PROGIII - API REST de Reservas de Salones de Cumpleaños

**Trabajo Final Integrador – Programación III (2do cuatrimestre 2025 – UNER)**

### Integrantes del Grupo M

- Janet Casaretto
- Franco Challiol
- Damián Ottone
- Micaela Zalazar
- Florencia Camino

---

## Descripción general

API REST desarrollada en **Node.js + Express** para la **gestión integral de reservas de salones de cumpleaños**.  
Incluye autenticación y autorización con **JWT**, control de roles (`Administrador`, `Empleado`, `Cliente`), manejo de datos en **MySQL**, y envío automático de **notificaciones por correo**.

---

## Funcionalidades principales

### Autenticación y autorización

- Login con **JWT**.
- Autorización por **rol** usando middlewares.
- Validación automática de token (`/auth/validar`).

### Administración

- CRUD completo (BREAD) para:
  - **Usuarios**
  - **Salones**
  - **Servicios**
  - **Turnos**
  - **Reservas**
- Soft delete (`activo = 0` en lugar de borrado físico).
- Validaciones de campos con `express-validator`.

### Notificaciones

- Envío automático de correos:
  - Al cliente cuando realiza una reserva.
  - Al administrador cuando se registra una nueva reserva.
- Plantillas de correo en **Handlebars (.hbs)** con banners rotativos.

### Reportes y estadísticas

- Generación de informes **PDF / CSV**.
- Consultas estadísticas mediante **stored procedures**.

### Documentación

- Documentación **Swagger** interactiva:
  - Incluye ejemplos por rol y estructura de respuesta estándar.
  - Accesible en `/swagger`.

---

## Arquitectura y organización del proyecto

```

FINAL-INTEGRADOR-PROG3/
├─ src/
│  ├─ app.js                      # Configuración principal de Express
│  ├─ server.js                   # Punto de entrada: levanta el servidor y DB
│  │
│  ├─ config/                     # Configuración global
│  │   ├─ db.js                   # Pool de conexiones MySQL (mysql2/promise)
│  │   ├─ initDB.js               # Creación inicial de tablas extras
│  │   └─ swagger.js              # Configuración Swagger
│  │
│  ├─ controllers/                # Lógica de capa Controller (HTTP)
│  │   ├─ auth.controller.js
│  │   ├─ servicios.controller.js
│  │   ├─ salones.controller.js
│  │   ├─ turnos.controller.js
│  │   ├─ usuarios.controller.js
│  │   └─ reservas.controller.js
│  │
│  ├─ enums/                      # Enumeraciones globales
│  │   └─ roles.js                # Enumeración de roles (1=Admin, 2=Empleado, 3=Cliente)
│  │
│  ├─ middlewares/                # Middlewares reutilizables
│  │   ├─ auth/
│  │   │   ├─ JWTMiddleware.js
│  │   │   └─ RoleMiddleware.js
│  │   ├─ cache/
│  │   │   └─ CacheMiddleware.js          # Limpia caché de apicache en operaciones POST/PUT/DELETE │
│  │   └─ validators/
│  │       └─ FieldsValidator.js       # Maneja resultados de express-validator
│  │
│  ├─ models/                     # Acceso a datos (consultas SQL)
│  │   ├─ servicios.js
│  │   ├─ salones.js
│  │   ├─ turnos.js
│  │   ├─ usuarios.js
│  │   └─ reservas.js
│  │
│  ├─ routes/                     # Endpoints agrupados por recurso
│  │   ├─ auth.routes.js
│  │   ├─ servicios.routes.js
│  │   ├─ salones.routes.js
│  │   ├─ turnos.routes.js
│  │   ├─ usuarios.routes.js
│  │   └─ comentarios.routes.js
│  │
│  ├─ services/                   # Lógica de negocio / capa intermedia
│  │   ├─ servicios.service.js
│  │   ├─ salones.service.js
│  │   ├─ turnos.service.js
│  │   ├─ usuarios.service.js
│  │   └─ reservas.service.js
│  │
│  ├─ utils/                      # Utilidades globales
│  │   ├─ jwt.js                  # Generación/verificación de JWT
│  │   ├─ notifications.js        # Envío de correos con nodemailer + handlebars
│  │   ├─ responseBuilder.js      # Formato unificado de respuestas
│  │   └─ errorResponse.js        # Excepciones personalizadas
│  │
│  ├─ docs/                       # Documentación Swagger modular
│  │   └─ auth.docs.js
│  │
│  └─ views/emails/               # Plantillas de correo (.hbs)
│      ├─ layouts/
│      │   └─ main.hbs
│      ├─ reserva.admin.hbs
│      └─ reserva.hbs
│
├─ .env.example                   # Variables de entorno de ejemplo
├─ package.json
├─ package-lock.json
└─ README.md

```

---

## Instalación y configuración

1. **Clonar el repositorio**

   ```
   git clone https://github.com/FlorCamino/Final-Integrador-prog3
   cd Final-Integrador-prog3
   ```

````

2. **Instalar dependencias**

   ```
   npm install
   ```

3. **Configurar variables de entorno**

   ```
   cp .env.example .env
   ```

4. **Iniciar el servidor**

   ```
   npm run start
   ```

   El servidor estará disponible en:
      [http://localhost:4000](http://localhost:4000)

---

## Documentación interactiva

Swagger disponible en:
   [http://localhost:4000/swagger](http://localhost:4000/swagger)


````
