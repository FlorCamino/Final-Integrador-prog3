import apicache from 'apicache';

export default function clearCache(req, res, next) {
  const methodsToClear = ['POST', 'PUT', 'DELETE'];
  if (methodsToClear.includes(req.method)) {
    apicache.clear();
  }
  next();
}
