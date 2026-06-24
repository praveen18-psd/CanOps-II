import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deliveryStops, deliveryPersonInfo, DeliveryStop } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';

const STATUS_CONFIG = {
  completed: { color: '#059669', bg: '#D1FAE5', label: 'Delivered', icon: 'checkmark-circle' as const },
  in_transit: { color: '#7C3AED', bg: '#EDE9FE', label: 'In Transit', icon: 'navigate' as const },
  pending: { color: '#D97706', bg: '#FEF3C7', label: 'Pending', icon: 'time' as const },
  failed: { color: '#DC2626', bg: '#FEE2E2', label: 'Failed', icon: 'close-circle' as const },
};

const PAYMENT_ICON = { cash: '💵', wallet: '💳', upi: '📱' };

interface StopCardProps { stop: DeliveryStop; onPress: () => void; }

function StopCard({ stop, onPress }: StopCardProps) {
  const cfg = STATUS_CONFIG[stop.status];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.stopNumBadge}>
          <Text style={styles.stopNum}>#{stop.stopNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={12} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={styles.customerName}>{stop.customerName}</Text>
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
        <Text style={styles.address} numberOfLines={1}>{stop.address}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.quantityBadge}>
          <Ionicons name="cube-outline" size={13} color="#3B82F6" />
          <Text style={styles.quantityText}>{stop.quantity} can{stop.quantity > 1 ? 's' : ''}</Text>
        </View>
        <Text style={styles.amount}>₹{stop.amount} {PAYMENT_ICON[stop.paymentMethod]}</Text>
        {stop.notes && (
          <View style={styles.notesBadge}>
            <Ionicons name="information-circle-outline" size={13} color="#F59E0B" />
            <Text style={styles.notesText} numberOfLines={1}>Note</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [stops, setStops] = useState(deliveryStops);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  const completed = stops.filter(s => s.status === 'completed').length;
  const total = stops.length;
  const cashCollected = stops.filter(s => s.status === 'completed' && s.paymentMethod === 'cash').reduce((s, d) => s + d.amount, 0);

  const filtered = stops.filter(s => {
    if (activeTab === 'pending') return s.status === 'pending' || s.status === 'in_transit';
    if (activeTab === 'completed') return s.status === 'completed' || s.status === 'failed';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{deliveryPersonInfo.name} 👋</Text>
        </View>
        <TouchableOpacity style={styles.dealerBtn} onPress={() => Alert.alert('Dealer', `Call ${deliveryPersonInfo.dealerName}?\n${deliveryPersonInfo.dealerPhone}`, [{ text: 'Cancel' }, { text: 'Call', style: 'default' }])}>
          <Ionicons name="call-outline" size={20} color="#1A56DB" />
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <View style={styles.progressStat}>
            <Text style={styles.progressValue}>{completed}</Text>
            <Text style={styles.progressLabel}>Delivered</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={styles.progressValue}>{total - completed}</Text>
            <Text style={styles.progressLabel}>Remaining</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={styles.progressValue}>₹{cashCollected}</Text>
            <Text style={styles.progressLabel}>Cash</Text>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(completed / total) * 100}%` }]} />
        </View>
        <Text style={styles.progressPct}>{completed}/{total} stops · {Math.round((completed / total) * 100)}% complete</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Route', { stops })}>
          <Ionicons name="map-outline" size={20} color="#1A56DB" />
          <Text style={styles.actionBtnText}>Optimize Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ShiftSummary', { stops })}>
          <Ionicons name="document-text-outline" size={20} color="#059669" />
          <Text style={styles.actionBtnText}>Shift Summary</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['all', 'pending', 'completed'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
              {t === 'all' ? `All (${stops.length})` : t === 'pending' ? `Pending (${stops.filter(s => s.status === 'pending' || s.status === 'in_transit').length})` : `Done (${stops.filter(s => s.status === 'completed' || s.status === 'failed').length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StopCard stop={item} onPress={() => navigation.navigate('DeliveryDetail', { stop: item, setStops })} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="checkmark-done-circle" size={48} color="#D1FAE5" /><Text style={styles.emptyText}>All done! 🎉</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  greeting: { fontSize: 14, color: '#6B7280' },
  name: { fontSize: 20, fontWeight: '800', color: '#111827' },
  dealerBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  progressCard: { margin: 16, backgroundColor: '#1A56DB', borderRadius: 20, padding: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  progressStat: { alignItems: 'center' },
  progressValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  progressDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', height: 40 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: 6, backgroundColor: '#34D399', borderRadius: 3 },
  progressPct: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  actionRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  tabs: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, padding: 4, marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#1A56DB' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  stopNumBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  stopNum: { fontSize: 11, fontWeight: '700', color: '#1A56DB' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  customerName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 5 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  address: { fontSize: 13, color: '#6B7280', flex: 1 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quantityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  quantityText: { fontSize: 12, fontWeight: '600', color: '#1A56DB' },
  amount: { fontSize: 13, fontWeight: '700', color: '#374151', marginLeft: 'auto' as any },
  notesBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  notesText: { fontSize: 11, color: '#F59E0B', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 12, fontWeight: '600' },
});
