// src/app/features/catalog/brands/components/brand-form/brand-form.component.ts
import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Brand } from '../../../../../core/models/brand.model';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brand-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css'],
})
export class BrandFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() brandId?: string | null;

  readonly loading = signal(false);
  readonly title = computed(() =>
    this.mode === 'create' ? 'Cadastrar marca' : 'Editar marca',
  );

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    isActive: [true],
  });

  ngOnInit(): void {
    if (this.mode === 'edit' && this.brandId) {
      this.loadBrand(this.brandId);
    }
  }

  private async loadBrand(id: string): Promise<void> {
    try {
      this.loading.set(true);

      const brand = await firstValueFrom(
        this.catalogService.getBrandById(id),
      );

      if (brand) {
        this.form.patchValue({
          name: brand.name,
          slug: brand.slug,
          isActive: brand.isActive,
        });
      } else {
        this.notificationService.warning('Marca não encontrada.');
        this.router.navigate(['/catalog/brands']);
      }
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Não foi possível carregar os dados da marca.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.loading.set(true);
      const value = this.form.getRawValue();

      if (this.mode === 'create') {
        await firstValueFrom(
          this.catalogService.createBrand({
            name: value.name,
            slug: value.slug,
            isActive: value.isActive,
          }),
        );
        this.notificationService.success('Marca cadastrada com sucesso!');
      } else if (this.mode === 'edit' && this.brandId) {
        await firstValueFrom(
          this.catalogService.updateBrand(this.brandId, {
            name: value.name,
            slug: value.slug,
            isActive: value.isActive,
          }),
        );
        this.notificationService.success('Marca atualizada com sucesso!');
      }

      this.router.navigate(['/catalog/brands']);
    } catch (error) {
      console.error(error);
      this.notificationService.error(
        'Ocorreu um erro ao salvar a marca. Tente novamente.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  get nameControl() {
    return this.form.controls.name;
  }

  get slugControl() {
    return this.form.controls.slug;
  }
}
