// src/app/testing/mocks/orders.mock.ts

import { OrderStatus } from '../../core/enums/order-status.enum';
import { PaymentStatus } from '../../core/enums/payment-status.enum';

export interface OrderItemMock {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentMock {
  id: string;
  orderId: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  processedAt: Date;
  transactionId?: string;
}

export interface OrderMock {
  id: string;
  code: string;

  /** Relacionamento com o cliente */
  customerId: string;
  customerName: string;
  customerEmail: string;

  /** Snapshot opcional para a UI (order.customer?.name / .email) */
  customer?: {
    name: string;
    email: string;
  } | null;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemMock[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  couponCode: string | null;
  payments: PaymentMock[];
}

export const ORDERS_MOCK: OrderMock[] = [
  // Pedido 1 – João, camiseta + tênis, BF2025
  {
    id: 'ord-1001',
    code: 'WEB-2025-0001',
    customerId: 'cus-1001', // João Silva
    customerName: 'João Silva',
    customerEmail: 'joao.silva@example.com',
    customer: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
    },
    status: OrderStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date('2025-01-05T14:10:00Z'),
    updatedAt: new Date('2025-01-05T15:00:00Z'),
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1001',
        productId: 'p-1001', // Camiseta Essential Preta
        productName: 'Camiseta Essential Preta',
        quantity: 2,
        unitPrice: 89.9,
        totalPrice: 179.8,
      },
      {
        id: 'item-2',
        orderId: 'ord-1001',
        productId: 'p-1002', // Tênis Running Pro
        productName: 'Tênis Running Pro',
        quantity: 1,
        unitPrice: 399.9,
        totalPrice: 399.9,
      },
    ],
    subtotal: 579.7,
    totalDiscount: 30,
    total: 549.7,
    couponCode: 'BF2025',
    payments: [
      {
        id: 'pay-1',
        orderId: 'ord-1001',
        method: 'credit_card',
        status: PaymentStatus.PAID,
        amount: 549.7,
        processedAt: new Date('2025-01-05T14:30:00Z'),
        transactionId: 'TRX-ABC-0001',
      },
    ],
  },

  // Pedido 2 – Maria, fone bluetooth, sem cupom
  {
    id: 'ord-1002',
    code: 'WEB-2025-0002',
    customerId: 'cus-1002', // Maria Souza
    customerName: 'Maria Souza',
    customerEmail: 'maria.souza@example.com',
    customer: {
      name: 'Maria Souza',
      email: 'maria.souza@example.com',
    },
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: new Date('2025-01-06T10:20:00Z'),
    updatedAt: new Date('2025-01-06T10:20:00Z'),
    items: [
      {
        id: 'item-3',
        orderId: 'ord-1002',
        productId: 'p-1003', // Fone Bluetooth Studio
        productName: 'Fone Bluetooth Studio',
        quantity: 1,
        unitPrice: 749.9,
        totalPrice: 749.9,
      },
    ],
    subtotal: 749.9,
    totalDiscount: 0,
    total: 749.9,
    couponCode: null,
    payments: [],
  },

  // Pedido 3 – João, acessórios (boné + mochila) com WELCOME10
  {
    id: 'ord-1003',
    code: 'WEB-2025-0003',
    customerId: 'cus-1001', // João Silva
    customerName: 'João Silva',
    customerEmail: 'joao.silva@example.com',
    customer: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
    },
    status: OrderStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date('2025-01-08T09:40:00Z'),
    updatedAt: new Date('2025-01-08T10:05:00Z'),
    items: [
      {
        id: 'item-4',
        orderId: 'ord-1003',
        productId: 'p-1004', // Boné Urban Street
        productName: 'Boné Urban Street',
        quantity: 1,
        unitPrice: 129.9,
        totalPrice: 129.9,
      },
      {
        id: 'item-5',
        orderId: 'ord-1003',
        productId: 'p-1007', // Mochila Urbana Daypack
        productName: 'Mochila Urbana Daypack',
        quantity: 1,
        unitPrice: 219.9,
        totalPrice: 219.9,
      },
    ],
    subtotal: 349.8,
    totalDiscount: 34.98, // 10% (WELCOME10)
    total: 314.82,
    couponCode: 'WELCOME10',
    payments: [
      {
        id: 'pay-2',
        orderId: 'ord-1003',
        method: 'pix',
        status: PaymentStatus.PAID,
        amount: 314.82,
        processedAt: new Date('2025-01-08T09:55:00Z'),
        transactionId: 'TRX-PIX-0002',
      },
    ],
  },

  // Pedido 4 – Carla, cadeira gamer com BF2025
  {
    id: 'ord-1004',
    code: 'WEB-2025-0004',
    customerId: 'cus-1003', // Carla Menezes
    customerName: 'Carla Menezes',
    customerEmail: 'carla.menezes@example.com',
    customer: {
      name: 'Carla Menezes',
      email: 'carla.menezes@example.com',
    },
    status: OrderStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date('2025-01-10T15:10:00Z'),
    updatedAt: new Date('2025-01-10T15:40:00Z'),
    items: [
      {
        id: 'item-6',
        orderId: 'ord-1004',
        productId: 'p-1005', // Cadeira Gamer Pro RGB
        productName: 'Cadeira Gamer Pro RGB',
        quantity: 1,
        unitPrice: 1299.9,
        totalPrice: 1299.9,
      },
    ],
    subtotal: 1299.9,
    totalDiscount: 30, // BF2025 fixo
    total: 1269.9,
    couponCode: 'BF2025',
    payments: [
      {
        id: 'pay-3',
        orderId: 'ord-1004',
        method: 'credit_card',
        status: PaymentStatus.PAID,
        amount: 1269.9,
        processedAt: new Date('2025-01-10T15:25:00Z'),
        transactionId: 'TRX-CC-0003',
      },
    ],
  },

  // Pedido 5 – Pedro, enxoval + fone, ainda pendente
  {
    id: 'ord-1005',
    code: 'WEB-2025-0005',
    customerId: 'cus-1004', // Pedro Lima
    customerName: 'Pedro Lima',
    customerEmail: 'pedro.lima@example.com',
    customer: {
      name: 'Pedro Lima',
      email: 'pedro.lima@example.com',
    },
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: new Date('2025-01-11T18:00:00Z'),
    updatedAt: new Date('2025-01-11T18:00:00Z'),
    items: [
      {
        id: 'item-7',
        orderId: 'ord-1005',
        productId: 'p-1006', // Jogo de Lençol Premium
        productName: 'Jogo de Lençol Premium 600 Fios',
        quantity: 1,
        unitPrice: 259.9,
        totalPrice: 259.9,
      },
      {
        id: 'item-8',
        orderId: 'ord-1005',
        productId: 'p-1003', // Fone Bluetooth Studio
        productName: 'Fone Bluetooth Studio',
        quantity: 1,
        unitPrice: 749.9,
        totalPrice: 749.9,
      },
    ],
    subtotal: 1009.8,
    totalDiscount: 0,
    total: 1009.8,
    couponCode: null,
    payments: [],
  },

  // Pedido 6 – Ana Clara, camiseta + cadeira gamer com BF2025
  {
    id: 'ord-1006',
    code: 'WEB-2025-0006',
    customerId: 'cus-1005', // Ana Clara
    customerName: 'Ana Clara',
    customerEmail: 'ana.clara@example.com',
    customer: {
      name: 'Ana Clara',
      email: 'ana.clara@example.com',
    },
    status: OrderStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date('2025-01-12T11:30:00Z'),
    updatedAt: new Date('2025-01-12T12:00:00Z'),
    items: [
      {
        id: 'item-9',
        orderId: 'ord-1006',
        productId: 'p-1001', // Camiseta Essential Preta
        productName: 'Camiseta Essential Preta',
        quantity: 1,
        unitPrice: 89.9,
        totalPrice: 89.9,
      },
      {
        id: 'item-10',
        orderId: 'ord-1006',
        productId: 'p-1005', // Cadeira Gamer Pro RGB
        productName: 'Cadeira Gamer Pro RGB',
        quantity: 1,
        unitPrice: 1299.9,
        totalPrice: 1299.9,
      },
    ],
    subtotal: 1389.8,
    totalDiscount: 30,
    total: 1359.8,
    couponCode: 'BF2025',
    payments: [
      {
        id: 'pay-4',
        orderId: 'ord-1006',
        method: 'boleto',
        status: PaymentStatus.PAID,
        amount: 1359.8,
        processedAt: new Date('2025-01-13T09:10:00Z'),
        transactionId: 'TRX-BOL-0004',
      },
    ],
  },
];
