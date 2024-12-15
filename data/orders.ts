export type OrderStatus = 'pending_payment' | 'pending_delivery' | 'delivering' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'FH20241214001',
    totalAmount: 125.99,
    status: 'pending_payment',
    createdAt: '2024-12-14T19:30:00',
  },
  {
    id: '2',
    orderNumber: 'FH20241214002',
    totalAmount: 89.50,
    status: 'pending_delivery',
    createdAt: '2024-12-14T18:45:00',
  },
  {
    id: '3',
    orderNumber: 'FH20241214003',
    totalAmount: 156.75,
    status: 'delivering',
    createdAt: '2024-12-14T17:20:00',
  },
  {
    id: '4',
    orderNumber: 'FH20241214004',
    totalAmount: 78.25,
    status: 'completed',
    createdAt: '2024-12-14T15:10:00',
  },
  {
    id: '5',
    orderNumber: 'FH20241214005',
    totalAmount: 234.99,
    status: 'completed',
    createdAt: '2024-12-14T14:30:00',
  },
  {
    id: '6',
    orderNumber: 'FH20241214006',
    totalAmount: 67.50,
    status: 'pending_payment',
    createdAt: '2024-12-14T13:15:00',
  },
  {
    id: '7',
    orderNumber: 'FH20241214007',
    totalAmount: 189.99,
    status: 'delivering',
    createdAt: '2024-12-14T12:45:00',
  },
];
