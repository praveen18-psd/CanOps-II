import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deliveryStops, deliveryPersonInfo } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';

export default function ShiftSummaryScreen() {
  const navigation = useNavigation();
  const stops = deliveryStops;

  const completed = stops.filter(s => s.status === 'completed').length;
  const failed = stops.filter(s => s.status === 'failed').length;
  const pending = stops.filter(s => s.status === 'pending' || s.status === 'in_transit').length;
  const totalCash = stops.filter(s => s.status === 'completed' && s.paymentMethod === 'cash').reduce((s, d) => s + d.amount, 0);
  const totalCans = stops.filter(s => s.status === 'completed').reduce((s, d) => s + d.quantity, 0);
  const totalRevenue = stops.filter(s => s.status === 'completed').reduce((s, d) => s + d.amount, 0);

  const handleShare = async () => {
    const summary = `CanOps Shift Summary\n${new Date().toLocaleDateString('en-IN')}\n\nRider: ${deliveryPersonInfo.name}\nDealer: ${deliveryPersonInfo.dealerName}\n\nDeliveries: ${completed}/${stops.length}\nCans Delivered: ${totalCans}\nCash Collected: ₹${totalCash}\nTotal Revenue: ₹${totalRevenue}\nFailed: ${failed}\n\nPowered by CanOps`;
    try {
      await Share.share({ message: summary, title: 'Shift Summary' });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Shift Summary</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color="#1A56DB" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Date & Rider */}
        <View style={styles.riderCard}>
          <View style={styles.riderAvatar}>
            <Text style={styles.riderAvatarText}>{deliveryPersonInfo.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View>
            <Text style={styles.riderName}>{deliveryPersonInfo.name}</Text>
            <Text style={styles.riderSub}>{deliveryPersonInfo.dealerName} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressSection}>
          <View style={styles.bigCircle}>
            <Text style={styles.bigNum}>{completed}</Text>
            <Text style={styles.bigLabel}>of {stops.length}</Text>
          </View>
          <View style={styles.progressStats}>
            {[
              { icon: 'checkmark-circle' as const, color: '#059669', bg: '#D1FAE5', label: 'Delivered', value: completed },
              { icon: 'close-circle' as const, color: '#DC2626', bg: '#FEE2E2', label: 'Failed', value: failed },
              { icon: 'time' as const, color: '#D97706', bg: '#FEF3C7', label: 'Pending', value: pending },
            ].map(item => (
              <View key={item.label} style={[styles.miniStat, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={[styles.miniStatNum, { color: item.color }]}>{item.value}</Text>
                <Text style={[styles.miniStatLabel, { color: item.color }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Earnings & Collections</Text>
        <View style={styles.metricsGrid}>
          {[
            { icon: 'cash' as const, label: 'Cash to Handover', value: `₹${totalCash}`, color: '#059669', bg: '#D1FAE5' },
            { icon: 'cube' as const, label: 'Cans Delivered', value: totalCans, color: '#1A56DB', bg: '#DBEAFE' },
            { icon: 'card' as const, label: 'Total Revenue', value: `₹${totalRevenue}`, color: '#7C3AED', bg: '#EDE9FE' },
            { icon: 'trending-up' as const, label: 'Success Rate', value: `${Math.round((completed / stops.length) * 100)}%`, color: '#D97706', bg: '#FEF3C7' },
          ].map(item => (
            <View key={item.label} style={[styles.metricCard, { backgroundColor: item.bg }]}>
              <View style={styles.metricIconRow}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={[styles.metricValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Stop breakdown */}
        <Text style={styles.sectionTitle}>Delivery Breakdown</Text>
        <View style={styles.breakdownCard}>
          {stops.map((stop, i) => (
            <View key={stop.id} style={[styles.breakdownRow, i < stops.length - 1 && styles.breakdownBorder]}>
              <View style={[styles.breakdownDot, {
                backgroundColor: stop.status === 'completed' ? '#D1FAE5' : stop.status === 'failed' ? '#FEE2E2' : '#FEF3C7'
              }]}>
                <Ionicons
                  name={stop.status === 'completed' ? 'checkmark' : stop.status === 'failed' ? 'close' : 'time'}
                  size={14}
                  color={stop.status === 'completed' ? '#059669' : stop.status === 'failed' ? '#DC2626' : '#D97706'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.breakdownName}>{stop.customerName}</Text>
                <Text style={styles.breakdownZone}>{stop.zone} · {stop.quantity} can(s)</Text>
              </View>
              <Text style={[styles.breakdownAmount, { color: stop.status === 'completed' ? '#059669' : '#9CA3AF' }]}>
                {stop.status === 'completed' ? `₹${stop.amount}` : '—'}
              </Text>
            </View>
          ))}
        </View>

        {/* End Shift */}
        {pending === 0 && (
          <TouchableOpacity style={styles.endShiftBtn} onPress={() => Alert.alert('End Shift', 'Submit shift summary to dealer?', [
            { text: 'Cancel' },
            { text: 'Submit', onPress: () => Alert.alert('Submitted!', 'Your shift summary has been sent to the dealer.') }
          ])}>
            <Ionicons name="checkmark-done-circle" size={22} color="#fff" />
            <Text style={styles.endShiftText}>Submit & End Shift</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  riderCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16 },
  riderAvatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  riderAvatarText: { fontSize: 18, fontWeight: '800', color: '#1A56DB' },
  riderName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  riderSub: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  bigCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, borderColor: '#1A56DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' },
  bigNum: { fontSize: 28, fontWeight: '800', color: '#1A56DB' },
  bigLabel: { fontSize: 11, color: '#6B7280' },
  progressStats: { flex: 1, gap: 8 },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  miniStatNum: { fontSize: 16, fontWeight: '800' },
  miniStatLabel: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  metricCard: { flex: 1, minWidth: '45%', borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  metricIconRow: {},
  metricValue: { fontSize: 20, fontWeight: '800' },
  metricLabel: { fontSize: 11, color: '#374151', fontWeight: '500', textAlign: 'center' },
  breakdownCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  breakdownBorder: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  breakdownDot: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  breakdownName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  breakdownZone: { fontSize: 12, color: '#9CA3AF' },
  breakdownAmount: { fontSize: 13, fontWeight: '700' },
  endShiftBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#059669', borderRadius: 16, paddingVertical: 16, marginBottom: 8 },
  endShiftText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
