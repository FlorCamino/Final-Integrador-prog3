import { ErrorResponse } from './ErrorResponse.js';

export class ResponseBuilder {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      ok: true,
      mensaje: message,
      data,
    });
  }

  static handleError(res, error) {
    console.error('Error inesperado:', error);

    const status = error.statusCode || 500;
    const mensaje =
      error instanceof ErrorResponse
        ? error.message
        : error.message || 'Error interno del servidor';

    return res.status(status).json({
      ok: false,
      mensaje,
      ...(status === 500 ? { detalle: error.message } : {}),
    });
  }
}
