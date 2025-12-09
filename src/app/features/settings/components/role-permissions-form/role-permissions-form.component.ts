// src/app/features/settings/components/role-permissions-form/role-permissions-form.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionsViewModel } from '../../pages/settings-roles-page/settings-roles-page.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

interface PermissionGroup {
  label: string;
  key: string;
  items: { key: string; label: string; description: string }[];
}

@Component({
  standalone: true,
  selector: 'app-role-permissions-form',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './role-permissions-form.component.html',
  styleUrls: ['./role-permissions-form.component.css'],
})
export class RolePermissionsFormComponent implements OnChanges {
  @Input() value!: RolePermissionsViewModel;
  @Output() saved = new EventEmitter<RolePermissionsViewModel>();

  workingPermissions: Set<string> = new Set<string>();

  readonly groups: PermissionGroup[] = [
    {
      label: 'Dashboard & relatórios',
      key: 'dashboard',
      items: [
        {
          key: 'dashboard.view',
          label: 'Ver dashboard',
          description:
            'Acessar o painel inicial com métricas e resumo das vendas.',
        },
        {
          key: 'reports.view',
          label: 'Ver relatórios',
          description:
            'Visualizar relatórios consolidados de vendas, pedidos e estoque.',
        },
      ],
    },
    {
      label: 'Catálogo',
      key: 'catalog',
      items: [
        {
          key: 'catalog.view',
          label: 'Ver catálogo',
          description: 'Listar produtos, categorias e marcas.',
        },
        {
          key: 'catalog.edit',
          label: 'Editar catálogo',
          description:
            'Criar, editar e arquivar produtos, categorias e marcas.',
        },
      ],
    },
    {
      label: 'Pedidos & clientes',
      key: 'orders',
      items: [
        {
          key: 'orders.manage',
          label: 'Gerenciar pedidos',
          description:
            'Alterar status, criar pedidos manuais e registrar pagamentos.',
        },
        {
          key: 'customers.manage',
          label: 'Gerenciar clientes',
          description: 'Criar, editar e organizar dados de clientes.',
        },
      ],
    },
    {
      label: 'Configurações & segurança',
      key: 'settings',
      items: [
        {
          key: 'settings.store',
          label: 'Configurações da loja',
          description: 'Editar dados da loja, fuso horário e moeda.',
        },
        {
          key: 'settings.users',
          label: 'Gerenciar usuários',
          description: 'Criar e editar usuários do painel.',
        },
        {
          key: 'settings.roles',
          label: 'Gerenciar papéis',
          description: 'Configurar papéis e permissões.',
        },
      ],
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.workingPermissions = new Set(this.value.permissions ?? []);
    }
  }

  isChecked(key: string): boolean {
    return this.workingPermissions.has(key);
  }

  /** Usado no template para decidir o texto do botão "Selecionar/Remover todas" */
  isGroupSelected(group: PermissionGroup): boolean {
    return group.items.every((item) =>
      this.workingPermissions.has(item.key),
    );
  }

  togglePermission(key: string): void {
    if (this.workingPermissions.has(key)) {
      this.workingPermissions.delete(key);
    } else {
      this.workingPermissions.add(key);
    }
    // força mudança de referência para detecção de mudanças
    this.workingPermissions = new Set(this.workingPermissions);
  }

  toggleGroup(group: PermissionGroup): void {
    const allInGroupSelected = this.isGroupSelected(group);

    if (allInGroupSelected) {
      group.items.forEach((i) => this.workingPermissions.delete(i.key));
    } else {
      group.items.forEach((i) => this.workingPermissions.add(i.key));
    }

    // força mudança de referência
    this.workingPermissions = new Set(this.workingPermissions);
  }

  onSave(): void {
    const updated: RolePermissionsViewModel = {
      ...this.value,
      permissions: Array.from(this.workingPermissions),
    };
    this.saved.emit(updated);
  }
}
