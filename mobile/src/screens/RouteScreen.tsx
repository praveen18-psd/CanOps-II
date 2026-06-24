import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryStop } from '../data/mockData';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RouteScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [stops, setStops] = useState<DeliveryStop[]>(route.params?.stops ?? []);
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingStops = stops.filter(s => s.status === 'pending' || s.status === 'in_transit');

  const handleOptimize = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate route optimization by sorting by proximity (mock)
      const sorted = [...pendingStops].sort((a, b) => a.lat - b.lat);
      setStops(prev => {
        const completed = prev.filter(s => s.status === 'completed' || s.status === 'failed');
        return [...completed, ...sorted.map((s, i) => ({ ...s, stopNumber: i + 1 + completed.length }))];
      });
      setOptimized(true);
      setLoading(false);
    }, 1500);
  };

  const handleOpenInMaps = (stop: DeliveryStop) => {
    const url = Platform.OS === 'ios'
      ? `maps://app?daddr=${stop.lat},${stop.lng}`
      : `geo:${stop.lat},${stop.lng}?q=${encodeURIComponent(stop.address)}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps app'));
  };

  const handleOpenFullRoute = () => {
    if (pendingStops.length === 0) return;
    const waypoints = pendingStops.map(s => `${s.lat},${s.lng}`).join('/');
    const url = Platform.OS === 'ios'
      ? `maps://app?daddr=${pendingStops[pendingStops.length - 1].lat},${pendingStops[pendingStops.length - 1].lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${pendingStops[pendingStops.length - 1].lat},${pendingStops[pendingStops.length - 1].lng}&waypoints=${pendingStops.slice(0, -1).map(s => `${s.lat},${s.lng}`).join('|')}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps app'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Optimized Route</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapContent}>
          <Ionicons name="map" size={48} color="#93C5FD" />
          <Text style={styles.mapTitle}>Route Map</Text>
          <Text style={styles.mapSubtitle}>{pendingStops.length} stops · Anna Nagar & T. Nagar</Text>
          <TouchableOpacity style={styles.openMapsBtn} onPress={handleOpenFullRoute}>
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.openMapsBtnText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>
        {/* Decorative route dots */}
        {pendingStops.slice(0, 4).map((_, i) => (
          <View key={i} style={[styles.mapDot, { top: 40 + i * 50, left: 60 + i * 40 }]}>
            <Text style={styles.mapDotText}>{i + 1}</Text>
          </View>
        ))}
      </View>

      {/* Optimize Button */}
      {!optimized && (
        <View style={styles.optimizeContainer}>
          <TouchableOpacity style={styles.optimizeBtn} onPress={handleOptimize} disabled={loading}>
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.optimizeBtnText}>{loading ? 'Optimizing...' : 'One-Tap Route Optimization'}</Text>
          </TouchableOpacity>
          <Text style={styles.optimizeHint}>Reorders stops for shortest travel time</Text>
        </View>
      )}
      {optimized && (
        <View style={styles.optimizedBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#059669" />
          <Text style={styles.optimizedText}>Route optimized! Tap any stop to navigate.</Text>
        </View>
      )}

      {/* Stop list */}
      <Text style={styles.listTitle}>Delivery Stops</Text>
      <FlatList
        data={pendingStops}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.stopRow}>
            <View style={styles.stopLine}>
              <View style={styles.stopDot}>
                <Text style={styles.stopDotText}>{index + 1}</Text>
              </View>
              {index < pendingStops.length - 1 && <View style={styles.connector} />}
            </View>
            <View style={styles.stopCard}>
              <View style={styles.stopCardInner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stopName}>{item.customerName}</Text>
                  <Text style={styles.stopAddress} numberOfLines={1}>{item.address}</Text>
                  <Text style={styles.stopMeta}>{item.quantity} can(s) · ₹{item.amount} · {item.paymentMethod.toUpperCase()}</Text>
                </View>
                <View style={styles.stopActions}>
                  <TouchableOpacity style={styles.stopNavBtn} onPress={() => handleOpenInMaps(item)}>
                    <Ionicons name="navigate" size={16} color="#1A56DB" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.stopCallBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                    <Ionicons name="call" size={16} color="#059669" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-circle" size={40} color="#D1FAE5" />
            <Text style={styles.emptyText}>No pending stops!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  mapPlaceholder: { height: 200, backgroundColor: '#DBEAFE', margin: 16, borderRadius: 20, overflow: 'hidden', position: 'relative', alignItems: 'center', justifyContent: 'center' },
  mapContent: { alignItems: 'center', gap: 6 },
  mapTitle: { fontSize: 16, fontWeight: '700', color: '#1E40AF' },
  mapSubtitle: { fontSize: 13, color: '#3B82F6' },
  openMapsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A56DB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 8 },
  openMapsBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  mapDot: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: '#1A56DB', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  mapDotText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  optimizeContainer: { marginHorizontal: 16, marginBottom: 8, alignItems: 'center' },
  optimizeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A56DB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, width: '100%', justifyContent: 'center' },
  optimizeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  optimizeHint: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  optimizedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, backgroundColor: '#D1FAE5', borderRadius: 10, padding: 10 },
  optimizedText: { fontSize: 13, color: '#065F46', fontWeight: '600' },
  listTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginHorizontal: 20, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  stopRow: { flexDirection: 'row', gap: 8 },
  stopLine: { alignItems: 'center', width: 32 },
  stopDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1A56DB', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  stopDotText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  connector: { width: 2, flex: 1, backgroundColor: '#BFDBFE', marginVertical: 4 },
  stopCard: { flex: 1, marginBottom: 8 },
  stopCardInner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  stopName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  stopAddress: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  stopMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  stopActions: { gap: 6 },
  stopNavBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  stopCallBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
});
