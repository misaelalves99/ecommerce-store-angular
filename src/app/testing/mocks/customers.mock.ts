// src/app/testing/mocks/customers.mock.ts

export interface CustomerAddressMock {
  id: string;
  street: string;
  number: string;
  complement?: string;
  district?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerMock {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  defaultAddressId: string | null;
  addresses: CustomerAddressMock[];
}

export const CUSTOMERS_MOCK: CustomerMock[] = [
  {
    id: 'cus-1001',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    document: '123.456.789-00',
    phone: '+55 (11) 99999-0001',
    createdAt: new Date('2025-01-01T12:00:00Z'),
    updatedAt: new Date('2025-01-10T12:00:00Z'),
    defaultAddressId: 'addr-1',
    addresses: [
      {
        id: 'addr-1',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        country: 'BR',
      },
    ],
  },
  {
    id: 'cus-1002',
    name: 'Maria Souza',
    email: 'maria.souza@example.com',
    document: '987.654.321-00',
    phone: '+55 (21) 98888-0002',
    createdAt: new Date('2025-01-02T12:00:00Z'),
    updatedAt: new Date('2025-01-11T12:00:00Z'),
    defaultAddressId: 'addr-2',
    addresses: [
      {
        id: 'addr-2',
        street: 'Av. Atlântica',
        number: '2000',
        complement: '',
        district: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22000-000',
        country: 'BR',
      },
    ],
  },
  {
    id: 'cus-1003',
    name: 'Carla Menezes',
    email: 'carla.menezes@example.com',
    document: '321.654.987-00',
    phone: '+55 (31) 97777-0003',
    createdAt: new Date('2025-01-03T10:30:00Z'),
    updatedAt: new Date('2025-01-12T10:30:00Z'),
    defaultAddressId: 'addr-3',
    addresses: [
      {
        id: 'addr-3',
        street: 'Rua Dom Pedro II',
        number: '450',
        complement: 'Casa',
        district: 'Funcionários',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30140-000',
        country: 'BR',
      },
    ],
  },
  {
    id: 'cus-1004',
    name: 'Pedro Lima',
    email: 'pedro.lima@example.com',
    document: '456.789.123-00',
    phone: '+55 (41) 96666-0004',
    createdAt: new Date('2025-01-04T09:15:00Z'),
    updatedAt: new Date('2025-01-13T09:15:00Z'),
    defaultAddressId: 'addr-4',
    addresses: [
      {
        id: 'addr-4',
        street: 'Rua XV de Novembro',
        number: '999',
        complement: 'Ap 1203',
        district: 'Centro',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80020-310',
        country: 'BR',
      },
      {
        id: 'addr-5',
        street: 'Rua das Palmeiras',
        number: '55',
        complement: 'Casa 02',
        district: 'Batel',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80240-000',
        country: 'BR',
      },
    ],
  },
  {
    id: 'cus-1005',
    name: 'Ana Clara',
    email: 'ana.clara@example.com',
    document: '159.753.486-00',
    phone: '+55 (71) 95555-0005',
    createdAt: new Date('2025-01-05T16:45:00Z'),
    updatedAt: new Date('2025-01-15T16:45:00Z'),
    defaultAddressId: 'addr-6',
    addresses: [
      {
        id: 'addr-6',
        street: 'Av. Paralela',
        number: '3500',
        complement: 'Torre Norte, sala 1204',
        district: 'Paralela',
        city: 'Salvador',
        state: 'BA',
        zipCode: '41740-000',
        country: 'BR',
      },
    ],
  },
  {
    id: 'cus-1006',
    name: 'Bruno Almeida',
    email: 'bruno.almeida@example.com',
    document: '741.258.963-00',
    phone: '+55 (51) 94444-0006',
    createdAt: new Date('2025-01-06T11:20:00Z'),
    updatedAt: new Date('2025-01-16T11:20:00Z'),
    defaultAddressId: 'addr-7',
    addresses: [
      {
        id: 'addr-7',
        street: 'Av. Ipiranga',
        number: '4000',
        complement: 'Bloco B, Ap 302',
        district: 'Jardim Botânico',
        city: 'Porto Alegre',
        state: 'RS',
        zipCode: '90610-000',
        country: 'BR',
      },
    ],
  },
];
