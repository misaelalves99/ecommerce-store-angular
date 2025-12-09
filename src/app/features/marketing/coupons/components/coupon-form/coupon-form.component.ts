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

import { Coupon } from '../../../../../core/models/coupon.model';
import { DiscountTypeEnum } from '../../../../../core/enums/discount-type.enum';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-coupon-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css'],
})
export class CouponFormComponent implements OnChanges {
  @Input() coupon: Coupon | null = null;
  @Output() submitted = new EventEmitter<Coupon>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  readonly discountTypes = [
    { value: DiscountTypeEnum.PERCENTAGE, label: 'Percentual (%)' },
    { value: DiscountTypeEnum.FIXED_AMOUNT, label: 'Valor fixo (R$)' },
    { value: DiscountTypeEnum.FREIGHT, label: 'Frete grátis' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coupon'] && this.coupon) {
      this.form.patchValue({
        code: this.coupon.code,
        name: this.coupon.name ?? '',
        description: this.coupon.description ?? '',
        type: this.coupon.type ?? this.coupon.discountType,
        value: this.coupon.value,
        minOrderValue:
          this.coupon.minOrderValue ?? this.coupon.minAmount ?? 0,
        maxUses:
          this.coupon.maxUses ?? this.coupon.usageLimit ?? null,
        validFrom: this.coupon.validFrom,
        validUntil: this.coupon.validUntil ?? null,
        active: this.coupon.active ?? this.coupon.isActive ?? true,
      });
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required]],
      description: [''],
      type: [DiscountTypeEnum.PERCENTAGE, [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      minOrderValue: [0, [Validators.min(0)]],
      maxUses: [null],
      validFrom: ['', Validators.required],
      validUntil: ['', Validators.required],
      active: [true],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const dto: Coupon = {
      ...(this.coupon ?? { id: crypto.randomUUID() }),

      code: raw['code'],
      name: raw['name'],
      description: raw['description'],

      discountType: raw['type'],
      type: raw['type'],

      value: raw['value'],

      minOrderAmount: raw['minOrderValue'],
      minOrderValue: raw['minOrderValue'],
      minAmount: raw['minOrderValue'],

      usageLimit: raw['maxUses'],
      maxUses: raw['maxUses'],

      startsAt: raw['validFrom'],
      expiresAt: raw['validUntil'],
      validFrom: raw['validFrom'],
      validUntil: raw['validUntil'],

      active: raw['active'],
      isActive: raw['active'],
    } as Coupon;

    this.submitted.emit(dto);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }
}
