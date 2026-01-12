import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/editSavingsStyles';
import {
  deleteSavingsGoal,
  getSavings,
  getUser,
  updateSavingsAmount,
  updateSavingsGoal,
} from '../utils/mmkvStorage';

export default function EditSavingsGoalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, font, isDark } = useTheme();

  const savings = getSavings();
  const goal = savings.find(g => g.id === id);

  if (!goal) {
    return (
      <ThemeWrapper>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.text }}>Goal not found</Text>
        </SafeAreaView>
      </ThemeWrapper>
    );
  }

  const originalAmount = goal.currentAmount;

  const [name, setName] = useState(goal.name);
  const [targetAmount, setTargetAmount] = useState(String(goal.targetAmount));
  const [currentAmount, setCurrentAmount] = useState(String(goal.currentAmount));

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiredAmount, setRequiredAmount] = useState(0);

  /* ================= VALIDATE ================= */
  const proceedSave = () => {
    const target = Number(targetAmount);
    const current = Number(currentAmount);

    if (!name.trim()) return setErrorMessage('Goal name is required');
    if (isNaN(target) || target <= 0) return setErrorMessage('Invalid target amount');
    if (isNaN(current) || current < 0) return setErrorMessage('Invalid current amount');
    if (current > target) return setErrorMessage('Current amount cannot exceed target');

    const user = getUser();
    if (!user) return setErrorMessage('User not found');

    const increase = current - originalAmount;
    if (increase > 0 && increase > user.balance) {
      setRequiredAmount(increase);
      setErrorMessage('');
      return;
    }

    setErrorMessage('');
    setShowConfirm(true);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    updateSavingsGoal(goal.id, name.trim(), Number(targetAmount));
    updateSavingsAmount(goal.id, Number(currentAmount));
    setShowConfirm(false);
    router.back();
  };

  /* ================= DELETE ================= */
  const handleDelete = () => {
    deleteSavingsGoal(goal.id);
    setShowDelete(false);
    router.replace('/savings');
  };

  return (
    <ThemeWrapper>
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors.background, paddingTop: 30 },
        ]}
      >
        {/* ================= HEADER ================= */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background, // ✅ FIX
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: font + 4, fontWeight: '700' },
            ]}
          >
            Edit Savings Goal
          </Text>

          <TouchableOpacity onPress={() => setShowDelete(true)}>
            <Icon
              name="trash-outline"
              size={22}
              color={colors.danger ?? '#d9534f'}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* ================= FORM ================= */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.muted }]}>
            Goal Name
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
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.muted }]}>
            Target Amount
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
            keyboardType="numeric"
            placeholder="0.00"
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { color: colors.muted }]}>
            Current Amount
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
            keyboardType="numeric"
            placeholder="0.00"
            value={currentAmount}
            onChangeText={setCurrentAmount}
            placeholderTextColor={colors.muted}
          />

          {!!errorMessage && (
            <Text style={{ color: colors.danger }}>
              {errorMessage}
            </Text>
          )}

          {/* ================= SAVE BUTTON ================= */}
          <TouchableOpacity
            style={{
              backgroundColor: '#1C2B3A',
              borderRadius: 18,
              paddingVertical: 18,
              alignItems: 'center',
              marginTop: 28,
            }}
            onPress={proceedSave}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= CONFIRM MODAL ================= */}
        <Modal transparent visible={showConfirm} animationType="fade">
          <View style={styles.sheetOverlay}>
            <View
              style={[
                styles.sheet,
                { backgroundColor: colors.card },
              ]}
            >
              <Image
                source={require('../../assets/successOwl.png')}
                style={styles.sheetImage}
              />

              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Confirm Changes
              </Text>

              <View style={[styles.sheetMessageBox, { backgroundColor: colors.background, width: '100%' }]}>
                {name !== goal.name && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Goal Name</Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>{name}</Text>
                  </View>
                )}
                {Number(targetAmount) !== goal.targetAmount && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Target Amount</Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>₱{Number(targetAmount).toLocaleString()}</Text>
                  </View>
                )}
                {Number(currentAmount) !== goal.currentAmount && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Current Amount</Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>
                      ₱{Number(currentAmount).toLocaleString()} 
                      <Text style={{ color: Number(currentAmount) > goal.currentAmount ? '#4CAF50' : '#EF4444' }}>
                        {' '}({Number(currentAmount) > goal.currentAmount ? '+' : ''}₱{(Number(currentAmount) - goal.currentAmount).toLocaleString()})
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.sheetButton}
                onPress={handleSave}
              >
                <Text style={styles.sheetButtonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={{ marginTop: 14 }}
              >
                <Text style={{ color: colors.muted }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ================= DELETE MODAL ================= */}
        <Modal transparent visible={showDelete} animationType="fade">
          <View style={styles.sheetOverlay}>
            <View
              style={[
                styles.sheet,
                { backgroundColor: colors.card, paddingHorizontal: 24 },
              ]}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 18,
                }}
              >
                Delete “{goal.name}”?
              </Text>

              <View
                style={{
                  backgroundColor: isDark ? '#1f2933' : '#f3f4f6',
                  borderRadius: 18,
                  padding: 18,
                  marginBottom: 28,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    textAlign: 'center',
                    lineHeight: 22,
                  }}
                >
                  This will{' '}
                  <Text style={{ color: '#d9534f', fontWeight: '700' }}>
                    delete your savings goal permanently.
                  </Text>
                  {'\n'}Are you sure?
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <TouchableOpacity
                                  style={styles.cancelButton}
                                  onPress={() => setShowDelete(false)}
                                >
                                  <Text
                                    style={[
                                      styles.cancelText,
                                      { color: colors.muted },
                                    ]}
                              >    
                  Cancel
                  </Text>
                </TouchableOpacity>
        

                <TouchableOpacity
                  style={[styles.sheetButton, { flex: 1, marginTop: 0 }]}
                  onPress={handleDelete}
                >
                  <Text style={styles.sheetButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeWrapper>
  );
}
