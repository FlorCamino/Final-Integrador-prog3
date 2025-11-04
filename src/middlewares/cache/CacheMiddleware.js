import apicache from 'apicache';

export class CacheMiddleware {
  static clear(req, res, next) {
    const methodsToClear = ['POST', 'PUT', 'PATCH', 'DELETE'];

    if (methodsToClear.includes(req.method)) {
      const baseUrl = req.originalUrl ? req.originalUrl.split('?')[0] : req.baseUrl;

      if (baseUrl) {
        apicache.clear(baseUrl);
        console.log(`Limpieza de cache para ruta: ${baseUrl}`);
      } else {
        apicache.clear();
        console.log('Limpieza de cache global');
      }
    }
    next();
  }
}
