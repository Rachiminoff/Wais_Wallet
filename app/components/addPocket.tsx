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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleContinue = () => {
    const name = pocketName.trim();
    const amount = parseFloat(fundAmount);

    if (!name || !fundAmount.trim()) return;
    if (isNaN(amount) || amount <= 0) return;

    const user = getUser();
    if (!user) return;

    if (amount > user.balance) return;

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    createPocket(pocketName.trim(), parseFloat(fundAmount));
    setShowConfirm(false);
    router.back();
  };

  return (
    <ThemeWrapper>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
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

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text },
            ]}
          >
            Add Pocket
          </Text>
        </View>

        {/* ================= FORM ================= */}
        <View style={styles.formGroup}>
          <Text
            style={[
              styles.label,
              { color: colors.textMuted },
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
            placeholderTextColor={colors.textMuted}
            value={pocketName}
            onChangeText={setPocketName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text
            style={[
              styles.label,
              { color: colors.textMuted },
            ]}
          >
            Fund amount
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
            placeholder="Enter fund amount"
            placeholderTextColor={colors.textMuted}
            value={fundAmount}
            onChangeText={setFundAmount}
            keyboardType="numeric"
          />
        </View>

        {/* ================= CONTINUE ================= */}
        <TouchableOpacity
          style={[
            styles.continueButton,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        {/* ================= CONFIRM MODAL ================= */}
        <Modal transparent visible={showConfirm} animationType="slide">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalSheet,
                { backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.text },
                ]}
              >
                Confirm Details
              </Text>

              <View
                style={[
                  styles.confirmCard,
                  { backgroundColor: colors.background },
                ]}
              >
                <View style={styles.confirmRow}>
                  <Text
                    style={[
                      styles.confirmLabel,
                      { color: colors.textMuted },
                    ]}
                  >
                    Pocket name
                  </Text>
                  <Text
                    style={[
                      styles.confirmValue,
                      { color: colors.text },
                    ]}
                  >
                    {pocketName}
                  </Text>
                </View>

                <View style={styles.confirmRow}>
                  <Text
                    style={[
                      styles.confirmLabel,
                      { color: colors.textMuted },
                    ]}
                  >
                    Amount
                  </Text>
                  <Text
                    style={[
                      styles.confirmValue,
                      { color: colors.text },
                    ]}
                  >
                    ₱{parseFloat(fundAmount).toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.backModalButton}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text
                    style={[
                      styles.backModalText,
                      { color: colors.text },
                    ]}
                  >
                    Go Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmModalButton,
                  ]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmModalText}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeWrapper>
  );
}
