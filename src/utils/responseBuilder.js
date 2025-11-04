import { ErrorResponse } from './errorResponse.js';

export class ResponseBuilder {
  static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      ok: true,
      mensaje: message,
      data,
    });
  }

  static created(res, data = null, message = 'Recurso creado correctamente') {
    return this.success(res, data, message, 201);
  }

  static deleted(res, message = 'Recurso eliminado correctamente') {
    return this.success(res, null, message, 200);
  }

  static handleError(res, error) {
    const status = error.statusCode || 500;
    const mensaje =
      error instanceof ErrorResponse
        ? error.message
        : error.message || 'Error interno del servidor';

    if (status >= 500) {
      console.error('[Error Interno del Servidor]:', error);
    } else {
      console.warn('[Error Controlado]:', mensaje);
    }

    return res.status(status).json({
      ok: false,
      mensaje,
      ...(process.env.NODE_ENV === 'development' && status === 500
        ? { detalle: error.stack }
        : {}),
    });
  }
}
