import conexionBaseDatos from "../config/db.js";
import consultasSQL from "../sql/reservas.sql.js";
import { transformarReservaParaDatos, transformarReservaParaBD, transformarParcialReservaParaBD } from "../utils/reserva.mapper.js";

export class RepositorioReservas {
  async obtenerTodas(cantidad, ordenarPor, ordenarDireccion) {
    const columnasValidas = [
      "reserva_id",
      "fecha_reserva",
      "salon_id",
      "usuario_id",
      "turno_id",
      "importe_total",
      "creado",
      "modificado",
    ];
    const direccionesValidas = ["ASC", "DESC"];

    let query = consultasSQL.obtenerTodas;

    if (ordenarPor && columnasValidas.includes(ordenarPor)) {
      const direccion = direccionesValidas.includes(ordenarDireccion?.toUpperCase())
        ? ordenarDireccion.toUpperCase()
        : "DESC";
      console.log(`Ordenando por ${ordenarPor} en dirección ${direccion}`);
      query += ` ORDER BY ${ordenarPor} ${direccion}`;
    } else {
      console.log("Ordenamiento no válido o no proporcionado. Usando orden por defecto.");
      query += " ORDER BY fecha_reserva DESC";
    }

    const parametros = [];
    if (cantidad && !isNaN(cantidad) && Number(cantidad) > 0) {
      query += " LIMIT ?";
      parametros.push(Number(cantidad));
    }

    console.log("Consulta SQL:", conexionBaseDatos.format(query, parametros));

    const [filas] = await conexionBaseDatos.query(query, parametros);
    return filas.map(transformarReservaParaDatos);
  }

  async obtenerPorId(idReserva, conexion = null) {
    const cx = conexion || conexionBaseDatos;
    const [filas] = await cx.query(consultasSQL.obtenerPorId, [idReserva]);
    if (!filas.length) return null;
    return transformarReservaParaDatos(filas[0]);
  }

  async obtenerCompletaPorId(idReserva, conexion = null) {
    const cx = conexion || conexionBaseDatos;
    const [filas] = await cx.query(consultasSQL.obtenerCompletaPorId, [idReserva]);
    if (!filas.length) return null;
    return filas[0];
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
      reserva.activo ?? 1,
    ];

    const [resultado] = await cx.query(consultasSQL.crear, parametros);

    return this.obtenerCompletaPorId(resultado.insertId, cx);
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
