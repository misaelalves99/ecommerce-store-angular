/**
 * Papéis de usuário no painel administrativo.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

/**
 * Labels amigáveis para exibição.
 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gestor',
  [UserRole.OPERATOR]: 'Operador',
  [UserRole.VIEWER]: 'Visualizador',
};
