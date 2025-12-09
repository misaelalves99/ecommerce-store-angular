// src/app/features/marketing/banners/components/banner-form/banner-form.component.ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Banner } from '../../../../../core/models/banner.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-banner-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css'],
})
export class BannerFormComponent implements OnChanges {
  @Input() banner: Banner | null = null;
  @Output() saved = new EventEmitter<Banner>();

  form: FormGroup;

  readonly positions = [
    { value: 'HOME_HERO', label: 'Home - Hero principal' },
    { value: 'HOME_STRIP', label: 'Home - Faixa promocional' },
    { value: 'CATEGORY_TOP', label: 'Categoria - Topo' },
    { value: 'CHECKOUT_SIDEBAR', label: 'Checkout - Lateral' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['banner']) {
      if (this.banner) {
        // Editando banner existente
        this.form.patchValue({
          title: this.banner.title,
          subtitle: this.banner.subtitle ?? '',
          position: this.banner.position,
          imageUrl: this.banner.imageUrl,
          linkUrl: this.banner.linkUrl,
          active: this.banner.isActive,
          background: this.banner.background ?? '',
          buttonLabel: this.banner.buttonLabel ?? '',
        });
      } else {
        // Criando novo banner
        this.form.reset({
          title: '',
          subtitle: '',
          position: this.positions[0].value,
          imageUrl: '',
          linkUrl: '',
          active: true,
          background: '',
          buttonLabel: '',
        });
      }
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      position: [this.positions[0].value, Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: ['', Validators.required],
      active: [true],
      background: [''],
      buttonLabel: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const dto: Banner = {
      ...(this.banner ?? { id: crypto.randomUUID() }),
      title: raw['title'],
      subtitle: raw['subtitle'],
      position: raw['position'],
      imageUrl: raw['imageUrl'],
      linkUrl: raw['linkUrl'],
      isActive: raw['active'],
      background: raw['background'] || null,
      buttonLabel: raw['buttonLabel'] || null,
    };

    this.saved.emit(dto);
  }
}
