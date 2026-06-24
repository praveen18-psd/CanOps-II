import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
  Linking, TextInput, Modal, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryStop } from '../data/mockData';
import { useNavigation, useRoute } from '@react-navigation/native';

const FAILURE_REASONS = ['Customer absent', 'Address not found', 'Customer refused', 'Locked premises', 'Insufficient payment', 'Other'];

export default function DeliveryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { stop: initialStop } = route.params;
  const [stop, setStop] = useState<DeliveryStop>(initialStop);
  const [failModal, setFailModal] = useState(false);
  const [failReason, setFailReason] = useState('');
  const [cashCollected, setCashCollected] = useState(String(stop.amount));
  const [proofNote, setProofNote] = useState('');

  const handleNavigate = () => {
    const url = Platform.OS === 'ios'
      ? `maps://app?daddr=${stop.lat},${stop.lng}`
      : `geo:${stop.lat},${stop.lng}?q=${encodeURIComponent(stop.address)}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps'));
  };

  const handleCall = () => Linking.openURL(`tel:${stop.phone}`).catch(() => {});

  const handleDelivered = () => {
    Alert.alert('Confirm Delivery', `Mark delivery to ${stop.customerName} as completed?\nCash collected: ₹${cashCollected}`, [
      { text: 'Cancel' },
      { text: 'Confirm', onPress: () => { setStop(s => ({ ...s, status: 'completed' })); navigation.goBack(); } }
    ]);
  };

  const handleFailed = () => {
    if (!failReason) { Alert.alert('Select a reason'); return; }
    setStop(s => ({ ...s, status: 'failed' }));
    setFailModal(false);
    Alert.alert('Reported', `Failure reported: ${failReason}. Dealer has been notified.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const STATUS_CONFIG = {
    completed: { color: '#059669', bg: '#D1FAE5', label: 'Delivered' },
    in_transit: { color: '#7C3AED', bg: '#EDE9FE', label: 'In Transit' },
    pending: { color: '#D97706', bg: '#FEF3C7', label: 'Pending' },
    failed: { color: '#DC2626', bg: '#FEE2E2', label: 'Failed' },
  };
  const cfg = STATUS_CONFIG[stop.status];

  return (
    <View style={styles.container}>
      {/* Nav header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Stop #{stop.stopNumber}</Text>
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusPillText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Customer card */}
        <View style={styles.section}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{stop.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{stop.customerName}</Text>
              <Text style={styles.phone}>{stop.phone}</Text>
            </View>
          </View>

          <View style={styles.addressBox}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.addressText}>{stop.address}</Text>
          </View>

          {stop.notes && (
            <View style={styles.noteBox}>
              <Ionicons name="information-circle" size={16} color="#D97706" />
              <Text style={styles.noteText}>{stop.notes}</Text>
            </View>
          )}
        </View>

        {/* Order details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.detailGrid}>
            {[
              { label: 'Cans', value: `${stop.quantity} × 20L` },
              { label: 'Amount', value: `₹${stop.amount}` },
              { label: 'Payment', value: stop.paymentMethod.toUpperCase() },
              { label: 'Slot', value: stop.slot.charAt(0).toUpperCase() + stop.slot.slice(1) },
            ].map(item => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cash collection */}
        {stop.paymentMethod === 'cash' && stop.status !== 'completed' && stop.status !== 'failed' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cash Collection</Text>
            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>Amount to collect: ₹{stop.amount}</Text>
              <View style={styles.cashInput}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput style={styles.cashField} keyboardType="numeric" value={cashCollected} onChangeText={setCashCollected} />
              </View>
            </View>
          </View>
        )}

        {/* Proof note */}
        {stop.status !== 'completed' && stop.status !== 'failed' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Note (Optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="E.g., Left at door, Given to security..."
              multiline
              numberOfLines={3}
              value={proofNote}
              onChangeText={setProofNote}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        {/* Action buttons */}
        {(stop.status === 'pending' || stop.status === 'in_transit') && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={handleCall}>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Call Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.navBtn]} onPress={handleNavigate}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deliverBtn]} onPress={handleDelivered}>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.actionBtnText}>Mark Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.failBtn]} onPress={() => setFailModal(true)}>
              <Ionicons name="close-circle" size={20} color="#DC2626" />
              <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Report Failure</Text>
            </TouchableOpacity>
          </View>
        )}

        {stop.status === 'completed' && (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-done-circle" size={32} color="#059669" />
            <Text style={styles.completedText}>Delivery Completed!</Text>
          </View>
        )}
      </ScrollView>

      {/* Failure Modal */}
      <Modal visible={failModal} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFailModal(false)}>
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Report Delivery Failure</Text>
            <Text style={styles.modalSubtitle}>Select the reason for failed delivery</Text>
            <View style={styles.reasons}>
              {FAILURE_REASONS.map(reason => (
                <TouchableOpacity key={reason} style={[styles.reasonBtn, failReason === reason && styles.reasonBtnActive]} onPress={() => setFailReason(reason)}>
                  <Text style={[styles.reasonText, failReason === reason && styles.reasonTextActive]}>{reason}</Text>
                  {failReason === reason && <Ionicons name="checkmark" size={16} color="#DC2626" />}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.submitFailBtn, !failReason && styles.submitFailBtnDisabled]} onPress={handleFailed} disabled={!failReason}>
              <Text style={styles.submitFailText}>Submit Report</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  navHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 12, fontWeight: '700' },
  scroll: { flex: 1 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#1A56DB' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  phone: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  addressBox: { flexDirection: 'row', gap: 8, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
  addressText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  noteBox: { flexDirection: 'row', gap: 8, backgroundColor: '#FFFBEB', borderRadius: 12, padding: 10, marginTop: 8 },
  noteText: { fontSize: 13, color: '#92400E', flex: 1 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detailItem: { flex: 1, minWidth: '45%', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
  detailLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cashRow: { gap: 10 },
  cashLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  cashInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#1A56DB', borderRadius: 12, paddingHorizontal: 12 },
  rupee: { fontSize: 18, color: '#1A56DB', fontWeight: '700', marginRight: 4 },
  cashField: { flex: 1, fontSize: 20, fontWeight: '700', paddingVertical: 12, color: '#111827' },
  noteInput: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 14, color: '#374151', textAlignVertical: 'top', minHeight: 80 },
  actions: { marginHorizontal: 16, marginTop: 16, marginBottom: 32, gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 14 },
  callBtn: { backgroundColor: '#374151' },
  navBtn: { backgroundColor: '#1A56DB' },
  deliverBtn: { backgroundColor: '#059669' },
  failBtn: { backgroundColor: '#FEE2E2', borderWidth: 1.5, borderColor: '#FCA5A5' },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  completedBanner: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  completedText: { fontSize: 18, fontWeight: '700', color: '#059669' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  reasons: { gap: 8 },
  reasonBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  reasonBtnActive: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  reasonText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  reasonTextActive: { color: '#DC2626', fontWeight: '700' },
  submitFailBtn: { marginTop: 20, backgroundColor: '#DC2626', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  submitFailBtnDisabled: { backgroundColor: '#FCA5A5' },
  submitFailText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
