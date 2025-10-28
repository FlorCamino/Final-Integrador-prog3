import { ejecutarConsulta, obtenerPool } from '../config/db.js';

export default class ReservasServicios {
    crearReservaConServicios = async(reserva_id, servicios) => {
            for (const servicio of servicios) {
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?,?,?);`;
                await ejecutarConsulta(sql, [reserva_id, servicio.servicio_id, servicio.importe]);
            }
        return true;
    }

    agregarServiciosDeReserva = async (reserva_id, nuevosServicios) => {
        for (const servicio of nuevosServicios) {
            const sql = 'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)';
            await ejecutarConsulta(sql, [reserva_id, servicio.servicio_id, servicio.importe]);
        }
    }

    modificarServiciosDeReserva = async (reserva_id, serviciosModificados) => {
        for (const servicio of serviciosModificados) {
            const sql = 'UPDATE reservas_servicios SET importe = ? WHERE reserva_id = ? AND servicio_id = ?';
            await ejecutarConsulta(sql, [servicio.importe, reserva_id, servicio.servicio_id]);
        }
    }

    eliminarServiciosDeReserva = async(reserva_id, serviciosEliminados) => {
        for (const servicio of serviciosEliminados) {
        const sql = 'DELETE FROM reservas_servicios WHERE reserva_id = ? AND servicio_id = ?';
        await ejecutarConsulta(sql, [reserva_id, servicio.servicio_id]);
        }
    }
}
