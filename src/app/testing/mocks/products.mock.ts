// src/app/testing/mocks/products.mock.ts

// Se precisar de DiscountType depois, é só importar:
// import { DiscountType } from '../../core/enums/discount-type.enum';

export interface ProductMockPrice {
  amount: number;
  currency: string;
  compareAtAmount?: number;
  // discountType?: DiscountType;
  // discountValue?: number;
}

export interface ProductMockStock {
  quantityAvailable: number;
  lowStockThreshold?: number;
  warehouseLocation?: string;
}

export interface ProductMock {
  id: string;
  name: string;
  sku: string;
  description: string;
  slug: string;
  categoryId: string;
  brandId: string;
  price: ProductMockPrice;
  stock: ProductMockStock;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export const PRODUCTS_MOCK: ProductMock[] = [
  {
    id: 'p-1001',
    name: 'Camiseta Essential Preta',
    sku: 'TSHIRT-ESS-BLACK',
    description: 'Camiseta básica 100% algodão, ideal para o dia a dia.',
    slug: 'camiseta-essential-preta',
    categoryId: 'cat-fashion',       // Moda & Vestuário
    brandId: 'brand-acme',           // ACME Wear
    price: {
      amount: 89.9,
      currency: 'BRL',
      compareAtAmount: 129.9,
    },
    stock: {
      quantityAvailable: 150,
      lowStockThreshold: 10,
      warehouseLocation: 'A-01-01',
    },
    isActive: true,
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-10T10:00:00Z'),
    tags: ['camiseta', 'básico', 'masculino'],
  },
  {
    id: 'p-1002',
    name: 'Tênis Running Pro',
    sku: 'SHOE-RUN-PRO',
    description: 'Tênis de corrida leve com amortecimento responsivo.',
    slug: 'tenis-running-pro',
    categoryId: 'cat-shoes',         // Calçados
    brandId: 'brand-runfast',        // RunFast
    price: {
      amount: 399.9,
      currency: 'BRL',
      compareAtAmount: 499.9,
    },
    stock: {
      quantityAvailable: 42,
      lowStockThreshold: 5,
      warehouseLocation: 'B-02-03',
    },
    isActive: true,
    createdAt: new Date('2025-01-02T10:00:00Z'),
    updatedAt: new Date('2025-01-12T10:00:00Z'),
    tags: ['tênis', 'esporte', 'corrida'],
  },
  {
    id: 'p-1003',
    name: 'Fone Bluetooth Studio',
    sku: 'HEAD-BT-STUDIO',
    description: 'Headphone bluetooth com cancelamento de ruído ativo.',
    slug: 'fone-bluetooth-studio',
    categoryId: 'cat-eletronics',    // Eletrônicos
    brandId: 'brand-soundmax',       // SoundMax
    price: {
      amount: 749.9,
      currency: 'BRL',
      compareAtAmount: 899.9,
    },
    stock: {
      quantityAvailable: 18,
      lowStockThreshold: 3,
      warehouseLocation: 'C-05-02',
    },
    isActive: true,
    createdAt: new Date('2025-01-03T10:00:00Z'),
    updatedAt: new Date('2025-01-13T10:00:00Z'),
    tags: ['fone', 'bluetooth', 'cancelamento-ruido'],
  },
  {
    id: 'p-1004',
    name: 'Boné Urban Street',
    sku: 'CAP-URBAN-STREET',
    description: 'Boné ajustável com aba curva e logo bordado.',
    slug: 'bone-urban-street',
    categoryId: 'cat-accessories',   // Acessórios (mock de categorias)
    brandId: 'brand-urbanstyle',     // UrbanStyle (mock de marcas)
    price: {
      amount: 129.9,
      currency: 'BRL',
      compareAtAmount: 159.9,
    },
    stock: {
      quantityAvailable: 65,
      lowStockThreshold: 8,
      warehouseLocation: 'A-03-05',
    },
    isActive: true,
    createdAt: new Date('2025-01-04T11:00:00Z'),
    updatedAt: new Date('2025-01-14T11:00:00Z'),
    tags: ['boné', 'acessórios', 'streetwear'],
  },
  {
    id: 'p-1005',
    name: 'Cadeira Gamer Pro RGB',
    sku: 'CHAIR-GAME-RGB',
    description:
      'Cadeira gamer ergonômica com ajuste de altura, inclinação e iluminação RGB.',
    slug: 'cadeira-gamer-pro-rgb',
    categoryId: 'cat-gaming',        // Jogos / PC Gamer
    brandId: 'brand-gametech',       // GameTech (mock de marcas)
    price: {
      amount: 1299.9,
      currency: 'BRL',
      compareAtAmount: 1499.9,
    },
    stock: {
      quantityAvailable: 22,
      lowStockThreshold: 4,
      warehouseLocation: 'D-01-02',
    },
    isActive: true,
    createdAt: new Date('2025-01-05T09:30:00Z'),
    updatedAt: new Date('2025-01-15T09:30:00Z'),
    tags: ['cadeira', 'gamer', 'rgb'],
  },
  {
    id: 'p-1006',
    name: 'Jogo de Lençol Premium 600 Fios',
    sku: 'BED-LINEN-600',
    description:
      'Jogo de lençol 600 fios, toque macio e acabamento premium para cama queen.',
    slug: 'jogo-lencol-premium-600-fios',
    categoryId: 'cat-home',          // Casa & Decoração
    brandId: 'brand-homeplus',       // HomePlus (mock de marcas)
    price: {
      amount: 259.9,
      currency: 'BRL',
      compareAtAmount: 329.9,
    },
    stock: {
      quantityAvailable: 37,
      lowStockThreshold: 6,
      warehouseLocation: 'E-04-01',
    },
    isActive: true,
    createdAt: new Date('2025-01-06T08:45:00Z'),
    updatedAt: new Date('2025-01-16T08:45:00Z'),
    tags: ['cama', 'lençol', 'premium'],
  },
  {
    id: 'p-1007',
    name: 'Mochila Urbana Daypack',
    sku: 'BACKPACK-URBAN-DAY',
    description:
      'Mochila leve com compartimento para notebook de 15" e bolsos organizadores.',
    slug: 'mochila-urbana-daypack',
    categoryId: 'cat-accessories',
    brandId: 'brand-urbanstyle',
    price: {
      amount: 219.9,
      currency: 'BRL',
      compareAtAmount: 249.9,
    },
    stock: {
      quantityAvailable: 54,
      lowStockThreshold: 7,
      warehouseLocation: 'A-04-02',
    },
    isActive: true,
    createdAt: new Date('2025-01-07T13:20:00Z'),
    updatedAt: new Date('2025-01-17T13:20:00Z'),
    tags: ['mochila', 'notebook', 'urbana'],
  },
];
