import apicache from 'apicache';

export class CacheMiddleware {
  static clear(req, res, next) {
    const methodsToClear = ['POST', 'PUT', 'DELETE'];
    if (methodsToClear.includes(req.method)) {
      apicache.clear();
    }
    next();
  }
}
