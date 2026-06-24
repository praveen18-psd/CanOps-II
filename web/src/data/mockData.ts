import { Customer, DeliveryPerson, Order, InventoryItem, Dealer, WeeklyStat, ZoneStat } from '../types';

export const dealer: Dealer = {
  id: 'dealer-1', name: 'Rajan Kumar', businessName: 'Rajan Pure Water',
  phone: '9876543210', email: 'rajan@rajanwater.com',
  address: '12, Gandhi Street, Anna Nagar, Chennai - 600040',
  gst: '33AABCR1234A1Z5',
  zones: ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Chromepet'],
  canPrice: 45, depositAmount: 150, active: true,
  referralBonus: 20, signupBonus: 30, referralEnabled: true,
};

export const customers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', phone: '9841001001', address: '14, 4th Cross, Anna Nagar', zone: 'Anna Nagar', lat: 13.0878, lng: 80.2107, walletBalance: 450, outstandingDues: 0, totalOrders: 142, joinDate: '2024-01-15', active: true, language: 'Tamil' },
  { id: 'c2', name: 'Karthik Murugan', phone: '9841002002', address: '7, MG Road, T. Nagar', zone: 'T. Nagar', lat: 13.0418, lng: 80.2341, walletBalance: 120, outstandingDues: 90, totalOrders: 87, joinDate: '2024-02-20', active: true, language: 'Tamil' },
  { id: 'c3', name: 'Anita Reddy', phone: '9841003003', address: '23, Beach Road, Adyar', zone: 'Adyar', lat: 13.0067, lng: 80.2561, walletBalance: 320, outstandingDues: 0, totalOrders: 203, joinDate: '2023-11-05', active: true, language: 'Telugu' },
  { id: 'c4', name: 'Suresh Iyer', phone: '9841004004', address: '5, Velachery Main Rd', zone: 'Velachery', lat: 12.9816, lng: 80.2209, walletBalance: 0, outstandingDues: 180, totalOrders: 56, joinDate: '2024-03-10', active: true, language: 'Tamil' },
  { id: 'c5', name: 'Meena Krishnan', phone: '9841005005', address: '18, Porur High Road', zone: 'Porur', lat: 13.0358, lng: 80.1571, walletBalance: 750, outstandingDues: 0, totalOrders: 311, joinDate: '2023-08-22', active: true, language: 'Tamil' },
  { id: 'c6', name: 'Vijay Patel', phone: '9841006006', address: '32, Old Mahabalipuram Rd, Chromepet', zone: 'Chromepet', lat: 12.9516, lng: 80.1462, walletBalance: 200, outstandingDues: 45, totalOrders: 94, joinDate: '2024-01-30', active: true, language: 'Kannada' },
  { id: 'c7', name: 'Lakshmi Narayanan', phone: '9841007007', address: '9, 6th Street, Anna Nagar', zone: 'Anna Nagar', lat: 13.0901, lng: 80.2134, walletBalance: 580, outstandingDues: 0, totalOrders: 178, joinDate: '2023-10-12', active: true, language: 'Tamil' },
  { id: 'c8', name: 'Ramesh Balasubramanian', phone: '9841008008', address: '45, T. Nagar Bus Stand Area', zone: 'T. Nagar', lat: 13.0390, lng: 80.2320, walletBalance: 90, outstandingDues: 135, totalOrders: 62, joinDate: '2024-04-01', active: true, language: 'Tamil' },
];

export const deliveryPersons: DeliveryPerson[] = [
  { id: 'dp1', name: 'Murugan S', phone: '9751001001', vehicleType: 'Two-Wheeler', zones: ['Anna Nagar', 'T. Nagar'], active: true, lat: 13.0860, lng: 80.2120, todayDeliveries: 18, completedDeliveries: 12, cashCollected: 540 },
  { id: 'dp2', name: 'Selvam R', phone: '9751002002', vehicleType: 'Three-Wheeler', zones: ['Adyar', 'Velachery'], active: true, lat: 13.0050, lng: 80.2550, todayDeliveries: 22, completedDeliveries: 15, cashCollected: 675 },
  { id: 'dp3', name: 'Kannan T', phone: '9751003003', vehicleType: 'Two-Wheeler', zones: ['Porur', 'Chromepet'], active: true, lat: 13.0340, lng: 80.1580, todayDeliveries: 14, completedDeliveries: 10, cashCollected: 450 },
  { id: 'dp4', name: 'Arun V', phone: '9751004004', vehicleType: 'Two-Wheeler', zones: ['Anna Nagar'], active: false, lat: 13.0870, lng: 80.2110, todayDeliveries: 0, completedDeliveries: 0, cashCollected: 0 },
];

const today = new Date().toISOString().split('T')[0];

export const orders: Order[] = [
  { id: 'o1', customerId: 'c1', customerName: 'Priya Sharma', customerAddress: '14, 4th Cross, Anna Nagar', customerPhone: '9841001001', zone: 'Anna Nagar', quantity: 2, slot: 'morning', status: 'delivered', deliveryPersonId: 'dp1', deliveryPersonName: 'Murugan S', paymentMethod: 'wallet', amount: 90, date: today, createdAt: `${today}T06:30:00`, deliveredAt: `${today}T09:15:00` },
  { id: 'o2', customerId: 'c2', customerName: 'Karthik Murugan', customerAddress: '7, MG Road, T. Nagar', customerPhone: '9841002002', zone: 'T. Nagar', quantity: 1, slot: 'morning', status: 'in_transit', deliveryPersonId: 'dp1', deliveryPersonName: 'Murugan S', paymentMethod: 'cash', amount: 45, date: today, createdAt: `${today}T07:00:00` },
  { id: 'o3', customerId: 'c3', customerName: 'Anita Reddy', customerAddress: '23, Beach Road, Adyar', customerPhone: '9841003003', zone: 'Adyar', quantity: 3, slot: 'morning', status: 'delivered', deliveryPersonId: 'dp2', deliveryPersonName: 'Selvam R', paymentMethod: 'wallet', amount: 135, date: today, createdAt: `${today}T06:45:00`, deliveredAt: `${today}T08:50:00` },
  { id: 'o4', customerId: 'c4', customerName: 'Suresh Iyer', customerAddress: '5, Velachery Main Rd', customerPhone: '9841004004', zone: 'Velachery', quantity: 2, slot: 'afternoon', status: 'assigned', deliveryPersonId: 'dp2', deliveryPersonName: 'Selvam R', paymentMethod: 'cash', amount: 90, date: today, createdAt: `${today}T08:00:00` },
  { id: 'o5', customerId: 'c5', customerName: 'Meena Krishnan', customerAddress: '18, Porur High Road', customerPhone: '9841005005', zone: 'Porur', quantity: 1, slot: 'morning', status: 'delivered', deliveryPersonId: 'dp3', deliveryPersonName: 'Kannan T', paymentMethod: 'upi', amount: 45, date: today, createdAt: `${today}T06:55:00`, deliveredAt: `${today}T09:30:00` },
  { id: 'o6', customerId: 'c6', customerName: 'Vijay Patel', customerAddress: '32, Old Mahabalipuram Rd, Chromepet', customerPhone: '9841006006', zone: 'Chromepet', quantity: 2, slot: 'morning', status: 'failed', deliveryPersonId: 'dp3', deliveryPersonName: 'Kannan T', paymentMethod: 'cash', amount: 90, date: today, createdAt: `${today}T07:15:00`, failureReason: 'Customer absent' },
  { id: 'o7', customerId: 'c7', customerName: 'Lakshmi Narayanan', customerAddress: '9, 6th Street, Anna Nagar', customerPhone: '9841007007', zone: 'Anna Nagar', quantity: 2, slot: 'afternoon', status: 'pending', paymentMethod: 'wallet', amount: 90, date: today, createdAt: `${today}T09:00:00` },
  { id: 'o8', customerId: 'c8', customerName: 'Ramesh Balasubramanian', customerAddress: '45, T. Nagar Bus Stand Area', customerPhone: '9841008008', zone: 'T. Nagar', quantity: 1, slot: 'evening', status: 'pending', paymentMethod: 'cash', amount: 45, date: today, createdAt: `${today}T09:30:00` },
];

export const inventory: InventoryItem[] = [
  { id: 'inv1', type: '20L Can', available: 84, dispatched: 54, returned: 12, threshold: 20 },
  { id: 'inv2', type: 'Empty Can', available: 42, dispatched: 0, returned: 42, threshold: 10 },
];

export const weeklyStats: WeeklyStat[] = [
  { day: 'Mon', orders: 52, revenue: 2340, delivered: 49, failed: 3 },
  { day: 'Tue', orders: 48, revenue: 2160, delivered: 45, failed: 3 },
  { day: 'Wed', orders: 61, revenue: 2745, delivered: 58, failed: 3 },
  { day: 'Thu', orders: 55, revenue: 2475, delivered: 52, failed: 3 },
  { day: 'Fri', orders: 67, revenue: 3015, delivered: 64, failed: 3 },
  { day: 'Sat', orders: 73, revenue: 3285, delivered: 70, failed: 3 },
  { day: 'Sun', orders: 41, revenue: 1845, delivered: 39, failed: 2 },
];

export const zoneStats: ZoneStat[] = [
  { zone: 'Anna Nagar', orders: 18, revenue: 810 },
  { zone: 'T. Nagar', orders: 24, revenue: 1080 },
  { zone: 'Adyar', orders: 15, revenue: 675 },
  { zone: 'Velachery', orders: 20, revenue: 900 },
  { zone: 'Porur', orders: 12, revenue: 540 },
  { zone: 'Chromepet', orders: 16, revenue: 720 },
];
