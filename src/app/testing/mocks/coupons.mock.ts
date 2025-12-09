// src/app/testing/mocks/coupons.mock.ts
import { DiscountType } from '../../core/enums/discount-type.enum';

export interface CouponMock {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  minAmount: number;
  maxAmount: number | null;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;          // importante: mesmo nome que o modelo/templ.
  usedCount?: number;        // total de usos
  maxUses?: number | null;   // limite de usos (null = infinito)
  createdAt: Date;
  updatedAt: Date;
}

export const COUPONS_MOCK: CouponMock[] = [
  {
    id: 'c-bf-2025',
    code: 'BF2025',
    description:
      'Cupom de Black Friday com desconto fixo em pedidos acima de R$ 300.',
    discountType: DiscountType.FIXED_AMOUNT,
    value: 30,
    minAmount: 300,
    maxAmount: null,
    isActive: true,
    validFrom: new Date('2025-11-20T00:00:00Z'),
    validUntil: new Date('2025-11-30T23:59:59Z'),
    usedCount: 125,
    maxUses: null,
    createdAt: new Date('2025-10-01T10:00:00Z'),
    updatedAt: new Date('2025-10-01T10:00:00Z'),
  },
  {
    id: 'c-welcome-10',
    code: 'WELCOME10',
    description: '10% de desconto na primeira compra.',
    discountType: DiscountType.PERCENTAGE,
    value: 10,
    minAmount: 0,
    maxAmount: 150,
    isActive: true,
    validFrom: new Date('2025-01-01T00:00:00Z'),
    validUntil: new Date('2025-12-31T23:59:59Z'),
    usedCount: 42,
    maxUses: 500,
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-05T10:00:00Z'),
  },
  {
    id: 'c-fretegratis-20',
    code: 'FRETE20',
    description:
      'Desconto fixo de R$ 20 para ajudar no frete em pedidos a partir de R$ 150.',
    discountType: DiscountType.FIXED_AMOUNT,
    value: 20,
    minAmount: 150,
    maxAmount: null,
    isActive: true,
    validFrom: new Date('2025-02-01T00:00:00Z'),
    validUntil: new Date('2025-06-30T23:59:59Z'),
    usedCount: 18,
    maxUses: null,
    createdAt: new Date('2025-01-20T09:00:00Z'),
    updatedAt: new Date('2025-01-20T09:00:00Z'),
  },
  {
    id: 'c-runfast-20',
    code: 'RUNFAST20',
    description:
      '20% de desconto em pedidos com foco na marca RunFast (linha esportiva).',
    discountType: DiscountType.PERCENTAGE,
    value: 20,
    minAmount: 300,
    maxAmount: 400,
    isActive: true,
    validFrom: new Date('2025-03-01T00:00:00Z'),
    validUntil: new Date('2025-09-30T23:59:59Z'),
    usedCount: 9,
    maxUses: 200,
    createdAt: new Date('2025-02-10T11:00:00Z'),
    updatedAt: new Date('2025-02-10T11:00:00Z'),
  },
  {
    id: 'c-eletronics-50',
    code: 'ELETRONICOS50',
    description:
      'R$ 50 de desconto em compras de eletrônicos acima de R$ 800.',
    discountType: DiscountType.FIXED_AMOUNT,
    value: 50,
    minAmount: 800,
    maxAmount: null,
    isActive: true,
    validFrom: new Date('2025-04-01T00:00:00Z'),
    validUntil: new Date('2025-08-31T23:59:59Z'),
    usedCount: 5,
    maxUses: 100,
    createdAt: new Date('2025-03-15T12:00:00Z'),
    updatedAt: new Date('2025-03-15T12:00:00Z'),
  },
  {
    id: 'c-home-15',
    code: 'HOME15',
    description:
      '15% de desconto em itens da categoria Casa & Conforto em pedidos a partir de R$ 200.',
    discountType: DiscountType.PERCENTAGE,
    value: 15,
    minAmount: 200,
    maxAmount: 250,
    isActive: true,
    validFrom: new Date('2025-05-01T00:00:00Z'),
    validUntil: new Date('2025-12-31T23:59:59Z'),
    usedCount: 30,
    maxUses: 300,
    createdAt: new Date('2025-04-10T13:00:00Z'),
    updatedAt: new Date('2025-04-10T13:00:00Z'),
  },
];
