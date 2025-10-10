import apicache from 'apicache';

export default function clearCache(req, res, next) {
  const methodsToClear = ['POST', 'PUT'];
  if (methodsToClear.includes(req.method)) {
    console.log(`Limpiando caché en el método ${req.method}...`);
    apicache.clear();
  }
  next();
}
