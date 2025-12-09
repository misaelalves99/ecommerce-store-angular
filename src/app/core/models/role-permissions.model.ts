// src/app/core/models/role-permissions.model.ts

import { UserRole } from '../enums/user-role.enum';

export interface RolePermissions {
  role: UserRole;
  description: string;
  permissions: string[];
}
