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
- MySQL/MariaDB
- Prisma ORM _(o mysql2, según configuración)_
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- Swagger (swagger-ui-express, swagger-jsdoc)
- nodemailer, pdfkit, json2csv
- dotenv, cors

---

## Estructura del proyecto

```
src/
├─ app.js                # configuración de Express
├─ server.js             # arranque del servidor
├─ config/               # variables de entorno y DB
├─ routes/               # definición de rutas por entidad
├─ controllers/          # controladores (request/response)
├─ services/             # lógica de negocio
├─ repositories/         # acceso a datos
├─ middlewares/          # JWT, roles, validaciones, errores
├─ validators/           # express-validator
├─ utils/                # helpers (bcrypt, pdf, mailer, etc.)
├─ docs/                 # swagger.js
└─ sql/                  # schema.sql, seed.sql, stored procedures
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

npm run dev # desarrollo
npm start # producción

---

## Documentación

Swagger disponible en:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
