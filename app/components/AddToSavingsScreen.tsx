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

import { useTheme } from '../context/ThemeContext';
import styles from '../styles/addToSavingsStyles';
import { SavingsGoal } from '../types';
import { addToSavings, getSavings } from '../utils/mmkvStorage';

export default function AddToSavingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [amount, setAmount] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* ================= LOAD GOAL ================= */
  const savings = getSavings();
  const goal: SavingsGoal | undefined = savings.find(
    g => g.id === id
  );

  if (!goal) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text, textAlign: 'center' }}>
          Savings goal not found
        </Text>
      </SafeAreaView>
    );
  }

  /* ================= HANDLER ================= */
  const handleAdd = () => {
    const value = Number(amount);

    if (isNaN(value) || value <= 0) {
      setErrorMessage('Please enter a valid amount');
      setErrorVisible(true);
      return;
    }

    try {
      // ✅ DOES NOT TOUCH user.balance
      addToSavings(goal.id, value);

      setAmount('');
      setSuccessVisible(true);
    } catch (err: any) {
      setErrorMessage(err.message ?? 'Something went wrong');
      setErrorVisible(true);
    }
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ================= ADD TO SAVINGS CARD ================= */}
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.modalTitle,
            { color: colors.text },
          ]}
        >
          Add to {goal.name}
        </Text>

        <Text
          style={[
            styles.modalLabel,
            { color: colors.muted },
          ]}
        >
          Amount to Add
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={colors.muted}
          style={[
            styles.modalInput,
            {
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        />

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.modalCancelText,
                { color: colors.muted },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalConfirm}
            onPress={handleAdd}
          >
            <Text style={styles.modalConfirmText}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= SUCCESS BOTTOM SHEET ================= */}
      <Modal visible={successVisible} transparent animationType="fade">
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
              resizeMode="contain"
            />

            <Text
              style={[
                styles.sheetTitle,
                { color: colors.text },
              ]}
            >
              Transfer Successful
            </Text>

            <View
              style={[
                styles.sheetMessageBox,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  styles.sheetMessage,
                  { color: colors.text },
                ]}
              >
                Savings added successfully.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => {
                setSuccessVisible(false);
                router.replace('/savings');
              }}
            >
              <Text style={styles.sheetButtonText}>
                Go to Savings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= ERROR BOTTOM SHEET ================= */}
      <Modal visible={errorVisible} transparent animationType="fade">
        <View style={styles.sheetOverlay}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.card },
            ]}
          >
            <Image
              source={require('../../assets/unsuccessfulOwl.png')}
              style={styles.sheetImage}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.sheetTitle,
                { color: colors.text },
              ]}
            >
              Transfer Unsuccessful
            </Text>

            <View
              style={[
                styles.sheetMessageBox,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  styles.sheetMessage,
                  { color: colors.text },
                ]}
              >
                {errorMessage}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => setErrorVisible(false)}
            >
              <Text style={styles.sheetButtonText}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
