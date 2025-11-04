import apicache from 'apicache';

const cache = apicache.options({
  appendKey: (req, res) => {
    if (req.user) {
      return `${req.user.usuario_id}-${req.user.tipo_usuario}`;
    }
    return 'anon';
  },
  debug: false,
}).middleware;

export default cache;
