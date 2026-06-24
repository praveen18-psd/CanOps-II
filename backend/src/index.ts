import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  orders, customers, deliveryPersons, inventory, dealer,
  weeklyStats, zoneStats, Order, Customer, DeliveryPerson
} from './data';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ─── Auth ───────────────────────────────────────────────────────────────────
app.post('/api/auth/dealer/login', (req, res) => {
  const { phone, password } = req.body;
  if (phone === dealer.phone && password === 'admin123') {
    res.json({ token: 'mock-jwt-token', dealer });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/delivery/login', (req, res) => {
  const { phone } = req.body;
  const person = deliveryPersons.find(dp => dp.phone === phone);
  if (person) {
    res.json({ token: 'mock-dp-token', deliveryPerson: person });
  } else {
    res.status(401).json({ error: 'Delivery person not found' });
  }
});

// ─── Orders ──────────────────────────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  const { date, status, zone } = req.query;
  let result = [...orders];
  if (date) result = result.filter(o => o.date === date);
  if (status) result = result.filter(o => o.status === status);
  if (zone) result = result.filter(o => o.zone === zone);
  res.json(result);
});

app.post('/api/orders', (req, res) => {
  const order: Order = { id: uuidv4(), createdAt: new Date().toISOString(), ...req.body };
  orders.push(order);
  res.status(201).json(order);
});

app.patch('/api/orders/:id/assign', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const dp = deliveryPersons.find(d => d.id === req.body.deliveryPersonId);
  if (!dp) return res.status(404).json({ error: 'Delivery person not found' });
  order.deliveryPersonId = dp.id;
  order.deliveryPersonName = dp.name;
  order.status = 'assigned';
  res.json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'delivered') order.deliveredAt = new Date().toISOString();
  if (req.body.failureReason) order.failureReason = req.body.failureReason;
  res.json(order);
});

// ─── Customers ───────────────────────────────────────────────────────────────
app.get('/api/customers', (_req, res) => res.json(customers));

app.post('/api/customers', (req, res) => {
  const customer: Customer = { id: uuidv4(), totalOrders: 0, walletBalance: 0, outstandingDues: 0, active: true, joinDate: new Date().toISOString().split('T')[0], ...req.body };
  customers.push(customer);
  res.status(201).json(customer);
});

app.patch('/api/customers/:id/wallet', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  customer.walletBalance += req.body.amount;
  res.json(customer);
});

// ─── Delivery Persons ─────────────────────────────────────────────────────────
app.get('/api/delivery-persons', (_req, res) => res.json(deliveryPersons));

app.post('/api/delivery-persons', (req, res) => {
  const dp: DeliveryPerson = { id: uuidv4(), active: true, lat: 13.0827, lng: 80.2707, todayDeliveries: 0, completedDeliveries: 0, cashCollected: 0, ...req.body };
  deliveryPersons.push(dp);
  res.status(201).json(dp);
});

app.patch('/api/delivery-persons/:id', (req, res) => {
  const dp = deliveryPersons.find(d => d.id === req.params.id);
  if (!dp) return res.status(404).json({ error: 'Not found' });
  Object.assign(dp, req.body);
  res.json(dp);
});

// ─── Inventory ────────────────────────────────────────────────────────────────
app.get('/api/inventory', (_req, res) => res.json(inventory));

// ─── Analytics ────────────────────────────────────────────────────────────────
app.get('/api/analytics/weekly', (_req, res) => res.json(weeklyStats));
app.get('/api/analytics/zones', (_req, res) => res.json(zoneStats));
app.get('/api/analytics/summary', (_req, res) => {
  const todayOrders = orders.filter(o => o.date === new Date().toISOString().split('T')[0]);
  res.json({
    todayOrders: todayOrders.length,
    todayDelivered: todayOrders.filter(o => o.status === 'delivered').length,
    todayRevenue: todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.amount, 0),
    todayFailed: todayOrders.filter(o => o.status === 'failed').length,
    totalCustomers: customers.filter(c => c.active).length,
    totalOutstanding: customers.reduce((s, c) => s + c.outstandingDues, 0),
    activeDeliveryPersons: deliveryPersons.filter(d => d.active).length,
  });
});

// ─── Dealer ───────────────────────────────────────────────────────────────────
app.get('/api/dealer', (_req, res) => res.json(dealer));
app.patch('/api/dealer', (req, res) => { Object.assign(dealer, req.body); res.json(dealer); });

app.listen(PORT, () => console.log(`CanOps API running on http://localhost:${PORT}`));
