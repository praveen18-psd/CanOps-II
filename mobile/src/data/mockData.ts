export interface DeliveryStop {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  zone: string;
  quantity: number;
  slot: 'morning' | 'afternoon' | 'evening';
  status: 'pending' | 'completed' | 'failed' | 'in_transit';
  amount: number;
  paymentMethod: 'cash' | 'wallet' | 'upi';
  notes?: string;
  lat: number;
  lng: number;
  stopNumber: number;
}

const today = new Date().toISOString().split('T')[0];

export const deliveryPersonInfo = {
  id: 'dp1',
  name: 'Murugan S',
  phone: '9751001001',
  vehicleType: 'Two-Wheeler',
  zones: ['Anna Nagar', 'T. Nagar'],
  dealerName: 'Rajan Pure Water',
  dealerPhone: '9876543210',
};

export const deliveryStops: DeliveryStop[] = [
  { id: 's1', customerName: 'Priya Sharma', phone: '9841001001', address: '14, 4th Cross, Anna Nagar', zone: 'Anna Nagar', quantity: 2, slot: 'morning', status: 'completed', amount: 90, paymentMethod: 'wallet', lat: 13.0878, lng: 80.2107, stopNumber: 1 },
  { id: 's2', customerName: 'Lakshmi Narayanan', phone: '9841007007', address: '9, 6th Street, Anna Nagar', zone: 'Anna Nagar', quantity: 2, slot: 'morning', status: 'in_transit', amount: 90, paymentMethod: 'cash', lat: 13.0901, lng: 80.2134, stopNumber: 2 },
  { id: 's3', customerName: 'Karthik Murugan', phone: '9841002002', address: '7, MG Road, T. Nagar', zone: 'T. Nagar', quantity: 1, slot: 'morning', status: 'pending', amount: 45, paymentMethod: 'cash', lat: 13.0418, lng: 80.2341, stopNumber: 3, notes: 'Call before delivery' },
  { id: 's4', customerName: 'Ramesh Balasubramanian', phone: '9841008008', address: '45, T. Nagar Bus Stand Area', zone: 'T. Nagar', quantity: 1, slot: 'afternoon', status: 'pending', amount: 45, paymentMethod: 'upi', lat: 13.0390, lng: 80.2320, stopNumber: 4 },
  { id: 's5', customerName: 'Kavitha Rajan', phone: '9841009009', address: '3, 2nd Avenue, Anna Nagar East', zone: 'Anna Nagar', quantity: 3, slot: 'morning', status: 'pending', amount: 135, paymentMethod: 'wallet', lat: 13.0850, lng: 80.2090, stopNumber: 5 },
  { id: 's6', customerName: 'Senthil Kumar', phone: '9841010010', address: '88, Usman Road, T. Nagar', zone: 'T. Nagar', quantity: 2, slot: 'afternoon', status: 'pending', amount: 90, paymentMethod: 'cash', lat: 13.0400, lng: 80.2300, stopNumber: 6 },
];
