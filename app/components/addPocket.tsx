import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from '../styles/addPocketStyles';
import { createPocket, getUser } from '../utils/mmkvStorage';

export default function AddPocket() {
  const router = useRouter();

  const [pocketName, setPocketName] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleContinue = () => {
    const name = pocketName.trim();
    const amount = parseFloat(fundAmount);

    if (!name || !fundAmount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    const user = getUser();
    if (!user) return;

    if (amount > user.balance) {
      Alert.alert('Error', 'Insufficient safe balance');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    createPocket(pocketName.trim(), parseFloat(fundAmount));
    setShowConfirm(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} color="#0f3d3e" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Add Pocket:</Text>

      {/* FORM */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pocket name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pocket name"
          value={pocketName}
          onChangeText={setPocketName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fund amount</Text>
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="Enter fund amount"
          value={fundAmount}
          onChangeText={setFundAmount}
          keyboardType="numeric"
        />
      </View>

      {/* CONTINUE BUTTON */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* CONFIRM MODAL */}
      <Modal transparent visible={showConfirm} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Confirm Details</Text>

            <View style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Pocket name</Text>
                <Text style={styles.confirmValue}>{pocketName}</Text>
              </View>

              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Amount</Text>
                <Text style={styles.confirmValue}>
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
                <Text style={styles.backModalText}>Go Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmModalButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmModalText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
