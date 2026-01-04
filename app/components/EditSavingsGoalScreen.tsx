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
  const { colors, isDark } = useTheme();

  const savings = getSavings();
  const goal = savings.find(g => g.id === id);

  if (!goal) {
    return (
      <ThemeWrapper>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
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
          { backgroundColor: colors.background },
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
              { color: colors.text },
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
          <View
            style={[
              styles.currencyInput,
              {
                backgroundColor: colors.card, // ✅ FIX
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.muted, marginRight: 6 }}>₱</Text>
            <TextInput
              style={[styles.inputInner, { color: colors.text }]}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholderTextColor={colors.muted}
            />
          </View>

          <Text style={[styles.label, { color: colors.muted }]}>
            Current Amount
          </Text>
          <View
            style={[
              styles.currencyInput,
              {
                backgroundColor: colors.card, // ✅ FIX
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.muted, marginRight: 6 }}>₱</Text>
            <TextInput
              style={[styles.inputInner, { color: colors.text }]}
              keyboardType="numeric"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              placeholderTextColor={colors.muted}
            />
          </View>

          {!!errorMessage && (
            <Text style={{ color: colors.danger }}>
              {errorMessage}
            </Text>
          )}
        </View>

        {/* ================= FOOTER ================= */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.background }, // ✅ FIX
          ]}
        >
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: colors.card },
            ]}
            onPress={() => router.back()}
          >
            <Text style={{ color: colors.text }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={proceedSave}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* ================= CONFIRM MODAL ================= */}
        <Modal transparent visible={showConfirm} animationType="slide">
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
        <Modal transparent visible={showDelete} animationType="slide">
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

              <View style={{ flexDirection: 'row', gap: 14 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#2b2f36' : '#e6f0ec',
                    paddingVertical: 16,
                    borderRadius: 20,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowDelete(false)}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0f3d3e',
                    paddingVertical: 16,
                    borderRadius: 20,
                    alignItems: 'center',
                  }}
                  onPress={handleDelete}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeWrapper>
  );
}
