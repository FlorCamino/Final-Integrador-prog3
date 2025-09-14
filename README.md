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

API REST para la **gestión de reservas de salones de cumpleaños**, con autenticación JWT y autorización por roles (**Cliente, Empleado, Administrador**).  
Permite administrar **usuarios, salones, servicios, turnos y reservas**, además de generar **reportes en PDF/CSV** y **estadísticas** con procedimientos almacenados en MySQL/MariaDB.

---

## Tecnologías utilizadas

- Node.js + Express
- MySQL/MariaDB (conexión con **mysql2**)
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- Swagger (swagger-ui-express, swagger-jsdoc)
- Nodemailer + Handlebars
- dotenv
- ESLint + Prettier

---

## Estructura del proyecto

```
FINAL-INTEGRADOR-PROG3/
├─ node_modules/
├─ src/
│  ├─ assets/                 # imágenes, logos, etc. (para emails)
│  ├─ config/                 # configuración central
│  │   ├─ db.js               # conexión a MySQL/MariaDB
│  │   ├─ env.js              # variables de entorno
│  │   └─ email.js            # nodemailer + handlebars
│  ├─ controllers/            # recibe requests y devuelve responses
│  │   └─ reservas.controller.js
│  ├─ docs/                   # documentación Swagger
│  │   └─ swagger.js
│  ├─ middlewares/            # validaciones, JWT, roles
│  │   ├─ reservas.validator.js
│  │   └─ validacion.resultado.js
│  ├─ repositories/           # acceso a datos (consultas DB)
│  │   └─ reservas.repository.js
│  ├─ routes/                 # definición de rutas por entidad
│  │   └─ reservas.routes.js
│  ├─ services/               # lógica de negocio
│  │   └─ reservas.service.js
│  ├─ sql/                    # queries SQL centralizadas
│  │   └─ reservas.sql.js
│  ├─ templates/              # plantillas handlebars para emails
│  │   └─ reserva.confirmada.hbs
│  ├─ utils/                  # helpers reutilizables
│  │   ├─ reserva.mapper.js   # transformación datos ↔ DB
│  │   └─ reserva.notificaciones.js
│  ├─ validators/             # validaciones específicas (si crecen más)
│  ├─ app.js                  # configuración express, middlewares globales
│  └─ server.js               # arranque del servidor
├─ .env                       # variables de entorno (local)
├─ .env.example               # variables de entorno de ejemplo
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## Instalación y configuración

1. Clonar repositorio:
   git clone https://github.com/FlorCamino/Final-Integrador-prog3

2. Instalar dependencias:
   npm install

3. Configurar variables de entorno:

cp .env.example .env

Editar `.env` con tus valores:
PORT=3000
DATABASE_URL="mysql://root:password@localhost:3306/reservas"
JWT_SECRET=supersecreto

4. Levantar el servidor:

npm run dev
npm start

---

## Documentación

Swagger disponible en:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
