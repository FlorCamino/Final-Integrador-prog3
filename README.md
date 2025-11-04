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

- Generación de informes **PDF / CSV / Excel**.
- Consultas estadísticas mediante **Procedimientos almacenados**.

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
│  │   ├─ passportConfig.js             # Configuración de la autenticación de usuarios
│  │   └─ swaggerConfig.js              # Configuración Swagger
│  │
│  ├─ controllers/                # Lógica de capa Controller (HTTP)
│  │   ├─ auth.controller.js
│  │   ├─ servicios.controller.js
│  │   ├─ salones.controller.js
│  │   ├─ turnos.controller.js
│  │   ├─ usuarios.controller.js
│  │   └─ reservas.controller.js
│  │
│  ├─ constants/                  # Enumeraciones globales
│  │   └─ roles.js                # Enumeración de roles (1=Admin, 2=Empleado, 3=Cliente)
│  │
│  ├─ middlewares/                # Middlewares reutilizables
│  │   ├─ auth/
│  │   │   └─ RoleMiddleware.js
│  │   ├─ cache/
│  │   │   └─ CacheMiddleware.js          # Limpia caché de apicache en operaciones POST/PUT/DELETE │
│  │   └─ validators/
│  │       └─ campos.validator.js       # Maneja resultados de express-validator
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
│  ├─ utils/                           # Funciones y clases auxiliares del proyecto
│  │   ├─ builders/                    # Generación de reportes en distintos formatos (CSV, Excel, PDF)
│  │   │   ├─ csvBuilder.js            # Genera reportes de reservas en formato CSV
│  │   │   ├─ excelBuilder.js          # Genera reportes e informes estadísticos en Excel (ExcelJS, estilos, moneda regional)
│  │   │   └─ pdfBuilder.js            # Crea reportes en PDF con diseño institucional
│  │   │
│  │   ├─ jwt.js                       # Generación y validación de tokens JWT para autenticación
│  │   ├─ notifications.js             # Envío de correos (Nodemailer)
│  │   ├─ responseBuilder.js           # Respuestas HTTP estandarizadas para la API
│  │   └─ errorResponse.js             # Clase personalizada para manejo de errores
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
