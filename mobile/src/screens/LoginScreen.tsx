import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props { onLogin: () => void; }

export default function LoginScreen({ onLogin }: Props) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length < 10) { Alert.alert('Invalid', 'Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1200);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) { Alert.alert('Invalid', 'Enter the 4-digit OTP'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="water" size={36} color="#fff" />
          </View>
          <Text style={styles.brand}>CanOps</Text>
          <Text style={styles.tagline}>Delivery Partner App</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {step === 'phone' ? (
            <>
              <Text style={styles.title}>Enter Mobile Number</Text>
              <Text style={styles.subtitle}>We'll send a verification code to your number</Text>
              <View style={styles.inputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity style={[styles.btn, phone.length < 10 && styles.btnDisabled]} onPress={handleSendOTP} disabled={phone.length < 10 || loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send OTP</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep('phone')}>
                <Ionicons name="arrow-back" size={18} color="#6B7280" />
                <Text style={styles.backText}>Change number</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>OTP sent to +91 {phone}</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="• • • •"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                textAlign="center"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={[styles.btn, otp.length < 4 && styles.btnDisabled]} onPress={handleVerifyOTP} disabled={otp.length < 4 || loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify & Login</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.resendBtn}>
                <Text style={styles.resendText}>Resend OTP in 30s</Text>
              </TouchableOpacity>
              <Text style={styles.demoHint}>Demo: use any 4-digit OTP</Text>
            </>
          )}
        </View>

        <Text style={styles.footer}>Powered by CanOps Platform v1.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A56DB' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  brand: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  inputRow: { flexDirection: 'row', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  countryCode: { backgroundColor: '#F9FAFB', paddingHorizontal: 14, justifyContent: 'center', borderRightWidth: 1.5, borderRightColor: '#E5E7EB' },
  countryCodeText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, fontSize: 16, color: '#111827' },
  otpInput: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 16, fontSize: 28, fontWeight: '700', letterSpacing: 12, color: '#111827', marginBottom: 16 },
  btn: { backgroundColor: '#1A56DB', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { fontSize: 13, color: '#6B7280' },
  resendBtn: { marginTop: 14, alignItems: 'center' },
  resendText: { fontSize: 13, color: '#9CA3AF' },
  demoHint: { textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 32 },
});
