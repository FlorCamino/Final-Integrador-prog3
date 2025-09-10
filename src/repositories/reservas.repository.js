import conexionBaseDatos from "../config/db.js";
import consultasSQL from "../sql/reservas.sql.js";
import { transformarReservaParaDatos, transformarReservaParaBD, transformarParcialReservaParaBD } from "../utils/reserva.mapper.js";

export class RepositorioReservas {
  async obtenerTodas() {
    const [filas] = await conexionBaseDatos.query(consultasSQL.obtenerTodas);
    return filas.map(transformarReservaParaDatos);
  }

  async obtenerPorId(idReserva) {
    const [filas] = await conexionBaseDatos.query(consultasSQL.obtenerPorId, [idReserva]);
    return transformarReservaParaDatos(filas[0]);
  }

  async crear(datos, conexion = null) {
    const cx = conexion || conexionBaseDatos;

    const reserva = transformarReservaParaBD(datos);
    const parametros = [
      reserva.fecha_reserva,
      reserva.salon_id,
      reserva.usuario_id,
      reserva.turno_id,
      reserva.foto_cumpleaniero ?? null,
      reserva.tematica ?? null,
      reserva.importe_salon ?? 0,
      reserva.importe_total ?? 0,
      reserva.activo,
    ];

    const [resultado] = await cx.query(consultasSQL.crear, parametros);
    return this.obtenerPorId(resultado.insertId);
  }

  async actualizar(idReserva, datos) {
    const camposBD = transformarParcialReservaParaBD(datos);

    const columnas = Object.keys(camposBD);
    const valores = Object.values(camposBD);

    if (columnas.length === 0) {
      throw new Error("No se proporcionaron campos válidos para actualizar.");
    }

    columnas.push("modificado");
    valores.push(new Date());

    const sets = columnas.map(col => `${col} = ?`).join(", ");

    const sql = `
      UPDATE reservas
        SET ${sets}
      WHERE reserva_id = ?
    `;

    valores.push(idReserva);

    const [resultado] = await conexionBaseDatos.query(sql, valores);
    if (!resultado.affectedRows) return null;

    return this.obtenerPorId(idReserva);
  }

    async eliminar(idReserva) {
      const [resultado] = await conexionBaseDatos.query(consultasSQL.eliminar, [idReserva]);
      if (!resultado.affectedRows) return null;
      return true;
    }
  }
