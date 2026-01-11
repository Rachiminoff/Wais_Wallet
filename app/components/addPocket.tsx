import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/addPocketStyles';
import { createPocket, getUser } from '../utils/mmkvStorage';

export default function AddPocket() {
  const router = useRouter();
  const { colors } = useTheme();

  const [pocketName, setPocketName] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [deductFromSafeBalance, setDeductFromSafeBalance] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const user = getUser();
  const safeBalance = user?.balance || 0;

  const handleContinue = () => {
    const name = pocketName.trim();
    const amount = parseFloat(fundAmount);

    if (!name || !fundAmount.trim()) return;
    if (isNaN(amount) || amount < 0) return;

    const user = getUser();
    if (!user) return;

    if (deductFromSafeBalance && amount > user.balance) return;

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    createPocket(pocketName.trim(), parseFloat(fundAmount), deductFromSafeBalance);
    setShowConfirm(false);
    router.back();
  };

  return (
    <ThemeWrapper>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: 50 },
        ]}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.headerTitle,
            { 
              color: colors.text,
              marginTop: 30,
              fontSize: 20,
              fontWeight: '700',
              marginHorizontal: 16,
              marginBottom: 24,
            },
          ]}
        >
          Add Pocket
        </Text>

        {/* ================= FORM ================= */}
        <View style={[styles.formGroup, { paddingHorizontal: 20 }]}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            Pocket name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter pocket name"
            placeholderTextColor="#9CA3AF"
            value={pocketName}
            onChangeText={setPocketName}
          />
        </View>

        <View style={[styles.formGroup, { paddingHorizontal: 20 }]}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            Initial Amount
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.amountInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter amount"
            placeholderTextColor="#9CA3AF"
            value={fundAmount}
            onChangeText={setFundAmount}
            keyboardType="numeric"
          />
        </View>

        {/* TOGGLE: DEDUCT FROM SAFE BALANCE */}
        <View style={[styles.formGroup, { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.text, fontWeight: '600', marginBottom: 4 }]}>
              Deduct from Safe Balance
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 16 }}>
              {deductFromSafeBalance 
                ? `Will deduct ₱${fundAmount || '0'} from Safe Balance (₱${safeBalance.toFixed(2)})`
                : 'Will not affect Safe Balance'}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: deductFromSafeBalance ? '#0f4248' : colors.border,
              padding: 2,
              justifyContent: 'center',
            }}
            onPress={() => setDeductFromSafeBalance(!deductFromSafeBalance)}
          >
            <View style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: '#fff',
              transform: [{ translateX: deductFromSafeBalance ? 20 : 0 }],
            }} />
          </TouchableOpacity>
        </View>

        {/* ================= CONTINUE ================= */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <TouchableOpacity
            style={[
              styles.continueButton,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* ================= CONFIRM MODAL ================= */}
        <Modal transparent visible={showConfirm} animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 24,
              width: '85%',
              maxWidth: 400,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                color: colors.text,
                textAlign: 'center',
              }}>
                Confirm Details
              </Text>

              <View style={{
                backgroundColor: colors.background,
                padding: 14,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: colors.icon,
                marginBottom: 24,
              }}>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                    Pocket Name
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                    {pocketName}
                  </Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                    Initial Amount
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                    ₱{parseFloat(fundAmount).toFixed(2)}
                  </Text>
                </View>

                {deductFromSafeBalance && (
                  <View>
                    <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                      Safe Balance
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                      ₱{safeBalance.toFixed(2)} → ₱{(safeBalance - parseFloat(fundAmount || '0')).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>

              {!deductFromSafeBalance && (
                <Text style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginBottom: 24,
                  lineHeight: 16,
                  textAlign: 'center',
                }}>
                  Note: Safe Balance will not be affected
                </Text>
              )}

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0f4248',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={handleConfirm}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeWrapper>
  );
}
