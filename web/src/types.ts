export type OrderStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
export type DeliverySlot = 'morning' | 'afternoon' | 'evening';
export type PaymentMethod = 'wallet' | 'upi' | 'cash';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  zone: string;
  lat: number;
  lng: number;
  walletBalance: number;
  outstandingDues: number;
  totalOrders: number;
  joinDate: string;
  active: boolean;
  language: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  zones: string[];
  active: boolean;
  lat: number;
  lng: number;
  todayDeliveries: number;
  completedDeliveries: number;
  cashCollected: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  zone: string;
  quantity: number;
  slot: DeliverySlot;
  status: OrderStatus;
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  paymentMethod: PaymentMethod;
  amount: number;
  date: string;
  createdAt: string;
  deliveredAt?: string;
  failureReason?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  type: string;
  available: number;
  dispatched: number;
  returned: number;
  threshold: number;
}

export interface Dealer {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  gst: string;
  zones: string[];
  canPrice: number;
  depositAmount: number;
  active: boolean;
  referralBonus: number;
  signupBonus: number;
  referralEnabled: boolean;
}

export interface WeeklyStat { day: string; orders: number; revenue: number; delivered: number; failed: number; }
export interface ZoneStat { zone: string; orders: number; revenue: number; }
