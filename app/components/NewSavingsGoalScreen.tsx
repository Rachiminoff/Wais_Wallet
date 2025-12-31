import { useRouter } from 'expo-router';
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

import { useTheme } from '../context/ThemeContext';
import styles from '../styles/newSavingsStyles';
import { createSavingsGoal } from '../utils/mmkvStorage';

export default function NewSavingsGoalScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startingAmount, setStartingAmount] = useState('');

  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = () => {
    try {
      if (!name.trim()) throw new Error('Goal name is required');

      const target = Number(targetAmount);
      const start = Number(startingAmount || 0);

      if (isNaN(target) || target <= 0)
        throw new Error('Invalid target amount');

      if (isNaN(start) || start < 0)
        throw new Error('Invalid starting amount');

      if (start > target)
        throw new Error('Starting amount cannot exceed target');

      createSavingsGoal(name.trim(), target, start);

      setSuccessVisible(true);
    } catch (err: any) {
      setErrorMessage(err.message);
      setErrorVisible(true);
    }
  };

  return (
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
          { backgroundColor: colors.background },
        ]}
      >
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
          New Savings Goal
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.border },
        ]}
      />

      {/* ================= FORM ================= */}
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>
          Goal Name
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="e.g. New Laptop"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Target Amount
        </Text>
        <View
          style={[
            styles.currencyInput,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.currency, { color: colors.text }]}>
            ₱
          </Text>
          <TextInput
            style={[
              styles.inputInner,
              { color: colors.text },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>
          Starting Amount (optional)
        </Text>
        <View
          style={[
            styles.currencyInput,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.currency, { color: colors.text }]}>
            ₱
          </Text>
          <TextInput
            style={[
              styles.inputInner,
              { color: colors.text },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            value={startingAmount}
            onChangeText={setStartingAmount}
          />
        </View>
      </View>

      {/* ================= ACTIONS ================= */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
        >
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
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
              Success
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
                Savings goal created!
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
                Go to Dashboard
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
              Creation Failed
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
