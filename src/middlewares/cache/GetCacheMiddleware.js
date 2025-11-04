import apicache from 'apicache';

const cache = apicache.middleware;

export const GetCache = (duration = '5 minutes') => {
  return (req, res, next) => {
    if (req.method === 'GET') {
      return cache(duration)(req, res, next);
    }
    next();
  };
};
