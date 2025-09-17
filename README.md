# PROGIII - API REST de Reservas de Salones de Cumpleaños

**Trabajo Final Integrador – Programación III (2do cuatrimestre 2025 – UNER)**

### Integrantes del grupo M

- Janet Casaretto
- Franco Challiol
- Damián Ottone
- Micaela Zalazar
- Florencia Camino

---

## Descripción

API REST para la **gestión de reservas de salones de cumpleaños**, con **autenticación JWT** y **autorización basada en roles** (`Cliente`, `Empleado`, `Administrador`).

La API permite administrar:

- **Usuarios**
- **Salones**
- **Servicios**
- **Turnos**
- **Reservas**

Además, incluye:

- Generación de **reportes en PDF y CSV**
- **Estadísticas** utilizando procedimientos almacenados en **MySQL/MariaDB**

---

## Tecnologías utilizadas

- **Node.js + Express**
- **MySQL/MariaDB** (conexión mediante `mysql2`)
- **JWT** (`jsonwebtoken`)
- **bcrypt** (hash de contraseñas)
- **express-validator** (validación de entradas)
- **Swagger** (`swagger-ui-express`, `swagger-jsdoc`)
- **Nodemailer + Handlebars** (envío de emails)
- **dotenv** (manejo de variables de entorno)
- **ESLint + Prettier** (estilo y buenas prácticas de código)

---

## Estructura del proyecto

```
FINAL-INTEGRADOR-PROG3/
├─ node_modules/
├─ src/
│  ├─ config/                 # Configuración central
│  │   ├─ db.js               # Conexión a MySQL/MariaDB
│  │   └─ swagger.js          # Configuración de Swagger
│  ├─ controllers/            # Controladores (reciben requests, devuelven responses)
│  │   └─ servicios.controller.js
│  ├─ middlewares/            # Middlewares (JWT, roles, validaciones)
│  │   └─ servicios.validator.js
│  ├─ repositories/           # Acceso a datos (queries SQL)
│  │   └─ servicios.repository.js
│  ├─ routes/                 # Definición de endpoints por entidad
│  │   └─ servicios.routes.js
│  ├─ services/               # Lógica de negocio
│  │   └─ servicios.service.js
│  ├─ validators/             # Validaciones específicas adicionales
│  ├─ app.js                  # Configuración Express y middlewares globales
├─ .env                       # Variables de entorno (local, no subir)
├─ .env.example               # Plantilla de variables de entorno
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## Instalación y configuración

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/FlorCamino/Final-Integrador-prog3
   cd Final-Integrador-prog3
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus valores locales:

   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=reservas
   DB_PORT=3306
   ```

4. **Levantar el servidor:**

   ```bash
   npm run start
   ```

---

## Documentación de la API

Swagger disponible en:
[http://localhost:4000/swagger](http://localhost:4000/swagger)
