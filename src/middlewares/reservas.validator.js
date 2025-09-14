import { body } from "express-validator";
import pool from "../config/db.js";

async function existeEnTabla(tabla, campo, valor) {
  const [filas] = await pool.query(`SELECT 1 FROM ${tabla} WHERE ${campo} = ?`, [valor]);
  return filas.length > 0;
}

export const validarReservaCreacion = [
  body("usuarioId")
    .isInt().withMessage("usuarioId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("usuarios", "usuario_id", valor))) {
        throw new Error("El usuarioId no existe en la base de datos");
      }
    }),

  body("salonId")
    .isInt().withMessage("salonId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("salones", "salon_id", valor))) {
        throw new Error("El salonId no existe en la base de datos");
      }
    }),

  body("turnoId")
    .isInt().withMessage("turnoId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("turnos", "turno_id", valor))) {
        throw new Error("El turnoId no existe en la base de datos");
      }
    }),

  body("fechaReserva")
    .isISO8601().withMessage("fechaReserva debe tener formato válido (YYYY-MM-DD)"),

  body("activo")
    .isIn([0, 1]).withMessage("activo debe ser 0 o 1"),

  body("tematica")
    .optional()
    .isString().withMessage("tematica debe ser una cadena de texto"),

  body("fotoCumpleaniero")
    .optional()
    .isString().withMessage("fotoCumpleaniero debe ser una cadena de texto"),

  body("importeSalon")
    .optional()
    .isDecimal().withMessage("importeSalon debe ser un número decimal"),

  body("importeTotal")
    .optional()
    .isDecimal().withMessage("importeTotal debe ser un número decimal")
];

export const validarReservaActualizacion = [
  body("usuarioId")
    .optional()
    .isInt().withMessage("usuarioId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("usuarios", "usuario_id", valor))) {
        throw new Error("El usuarioId no existe en la base de datos");
      }
    }),

  body("salonId")
    .optional()
    .isInt().withMessage("salonId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("salones", "salon_id", valor))) {
        throw new Error("El salonId no existe en la base de datos");
      }
    }),

  body("turnoId")
    .optional()
    .isInt().withMessage("turnoId debe ser un número entero")
    .custom(async valor => {
      if (!(await existeEnTabla("turnos", "turno_id", valor))) {
        throw new Error("El turnoId no existe en la base de datos");
      }
    }),

  body("fechaReserva")
    .optional()
    .isISO8601().withMessage("fechaReserva debe tener formato válido (YYYY-MM-DD)"),

  body("activo")
    .optional()
    .isIn([0, 1]).withMessage("activo debe ser 0 o 1"),

  body("tematica")
    .optional()
    .isString().withMessage("tematica debe ser una cadena de texto"),

  body("fotoCumpleaniero")
    .optional()
    .isString().withMessage("fotoCumpleaniero debe ser una cadena de texto"),

  body("importeSalon")
    .optional()
    .isDecimal().withMessage("importeSalon debe ser un número decimal"),

  body("importeTotal")
    .optional()
    .isDecimal().withMessage("importeTotal debe ser un número decimal")
];
