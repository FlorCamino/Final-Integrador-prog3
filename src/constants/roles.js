export const ROLES = {
  ADMINISTRADOR: 1,
  EMPLEADO: 2,
  CLIENTE: 3,
};

export const roles = {
  [ROLES.ADMINISTRADOR]: 'administrador',
  [ROLES.EMPLEADO]: 'empleado',
  [ROLES.CLIENTE]: 'cliente',
};

export function obtenerNombreRol(tipoUsuario) {
  return roles[tipoUsuario] || 'desconocido';
}
