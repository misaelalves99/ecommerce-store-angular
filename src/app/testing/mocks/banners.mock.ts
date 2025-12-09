// src/app/testing/mocks/banners.mock.ts

import { Banner } from '../../core/models/banner.model';

export const BANNERS_MOCK: Banner[] = [
  {
    id: 'b-home-hero-1',
    title: 'Nova coleção streetwear 2025',
    subtitle: 'Camisas, moletons e tênis com até 40% OFF.',
    position: 'HOME_HERO',
    imageUrl:
      'https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg',
    linkUrl: '/products?category=streetwear',
    isActive: true,
    background:
      'linear-gradient(90deg, rgba(8,47,73,1) 0%, rgba(15,23,42,1) 50%, rgba(6,95,70,1) 100%)',
    buttonLabel: 'Ver coleção',
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-05T12:00:00Z'),
  },
  {
    id: 'b-home-strip-1',
    title: 'Frete GRÁTIS acima de R$ 199',
    subtitle: 'Válido para Sul e Sudeste em produtos selecionados.',
    position: 'HOME_STRIP',
    imageUrl:
      'https://images.pexels.com/photos/5632380/pexels-photo-5632380.jpeg',
    linkUrl: '/shipping-policy',
    isActive: true,
    background:
      'linear-gradient(90deg, rgba(30,64,175,1) 0%, rgba(59,130,246,1) 50%, rgba(96,165,250,1) 100%)',
    buttonLabel: 'Saiba mais',
    createdAt: new Date('2025-01-02T09:30:00Z'),
    updatedAt: new Date('2025-01-06T11:15:00Z'),
  },
  {
    id: 'b-category-top-running',
    title: 'Linha RunFast',
    subtitle: 'Tênis de performance para corrida de rua e trilha.',
    position: 'CATEGORY_TOP',
    imageUrl:
      'https://images.pexels.com/photos/1401796/pexels-photo-1401796.jpeg',
    linkUrl: '/products?category=running',
    isActive: true,
    background:
      'linear-gradient(90deg, rgba(6,95,70,1) 0%, rgba(5,150,105,1) 50%, rgba(16,185,129,1) 100%)',
    buttonLabel: 'Comprar agora',
    createdAt: new Date('2025-01-03T14:20:00Z'),
    updatedAt: new Date('2025-01-07T18:45:00Z'),
  },
  {
    id: 'b-checkout-sidebar-1',
    title: 'Cupom WELCOME10',
    subtitle: 'Use no primeiro pedido e ganhe 10% OFF.',
    position: 'CHECKOUT_SIDEBAR',
    imageUrl:
      'https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg',
    linkUrl: '/marketing/coupons',
    isActive: true,
    background:
      'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 100%)',
    buttonLabel: 'Ver detalhes',
    createdAt: new Date('2025-01-04T08:10:00Z'),
    updatedAt: new Date('2025-01-08T16:30:00Z'),
  },
];
