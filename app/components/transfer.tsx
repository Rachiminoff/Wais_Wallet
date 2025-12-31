import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';

import styles from '../styles/transferStyles';
import { Packet } from '../types';
import {
  getPockets,
  getUser,
  transferFunds,
} from '../utils/mmkvStorage';

/* ASSETS */
const successOwl = require('../../assets/successOwl.png');
const unsuccessfulOwl = require('../../assets/unsuccessfulOwl.png');

export default function TransferScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [user, setUser] = useState(getUser());
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [selectedPocket, setSelectedPocket] =
    useState<Packet | null>(null);

  const [amount, setAmount] = useState('');
  const [transferredAmount, setTransferredAmount] = useState(0); // ✅ FIX
  const [error, setError] = useState('');

  const [showPicker, setShowPicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [transferDate, setTransferDate] = useState('');

  /* LOAD DATA */
  useEffect(() => {
    const pocketData = getPockets();
    setPockets(pocketData);
    setSelectedPocket(pocketData[0] ?? null);
    setUser(getUser());
  }, []);

  /* ANDROID-SAFE INPUT */
  const handleAmountChange = (text: string) => {
    let cleaned = text.replace(',', '.');
    cleaned = cleaned.replace(/[^0-9.]/g, '');

    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned =
        parts[0] + '.' + parts.slice(1).join('');
    }

    setAmount(cleaned);
  };

  /* TRANSFER */
  const handleTransfer = () => {
    try {
      if (!selectedPocket) {
        throw new Error('Please choose a pocket');
      }

      const value = Number(amount);

      if (!value || value <= 0) {
        throw new Error('Invalid transfer amount');
      }

      if (value > selectedPocket.amount) {
        throw new Error('Insufficient pocket balance');
      }

      transferFunds(selectedPocket.id, value);

      // ✅ SNAPSHOT values BEFORE clearing input
      setTransferredAmount(value);
      setTransferDate(new Date().toLocaleDateString());

      setShowSuccess(true);
      setAmount('');

      setPockets(getPockets());
      setUser(getUser());
    } catch (err: any) {
      setError(err.message);
      setShowError(true);
    }
  };

  const isAmountValid = Number(amount) > 0;

  return (
    <ThemeWrapper>
      <View
        style={[
          styles.safeArea,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[styles.title, { color: colors.text }]}
        >
          Transfer
        </Text>

        {/* FROM */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textMuted },
            ]}
          >
            From
          </Text>
          <View style={styles.row}>
            <Text
              style={[
                styles.boldText,
                { color: colors.text },
              ]}
            >
              {selectedPocket?.name ?? '(Choose Pocket)'}
            </Text>
            <Text
              style={[
                styles.amountText,
                { color: colors.text },
              ]}
            >
              ₱{selectedPocket?.amount.toFixed(2) ?? '0.00'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* TO */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textMuted },
            ]}
          >
            To
          </Text>
          <View style={styles.row}>
            <Text
              style={[
                styles.boldText,
                { color: colors.text },
              ]}
            >
              Safe Balance
            </Text>
            <Text
              style={[
                styles.amountText,
                { color: colors.text },
              ]}
            >
              ₱{user?.balance.toFixed(2) ?? '0.00'}
            </Text>
          </View>
        </View>

        {/* AMOUNT */}
        <View
          style={[
            styles.inputCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.inputLabel,
              { color: colors.textMuted },
            ]}
          >
            Transfer amount
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text },
            ]}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.textMuted}
            value={amount}
            onChangeText={handleAmountChange}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            !isAmountValid && { opacity: 0.5 },
          ]}
          disabled={!isAmountValid}
          onPress={handleTransfer}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* POCKET PICKER */}
        <Modal transparent visible={showPicker}>
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
                Choose Pocket
              </Text>

              <ScrollView>
                {pockets.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.option}
                    onPress={() => {
                      setSelectedPocket(p);
                      setShowPicker(false);
                    }}
                  >
                    <View style={styles.optionRow}>
                      <Text
                        style={[
                          styles.optionName,
                          { color: colors.text },
                        ]}
                      >
                        {p.name}
                      </Text>
                      <Text
                        style={[
                          styles.optionAmount,
                          { color: colors.text },
                        ]}
                      >
                        ₱{p.amount.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowPicker(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: colors.textMuted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SUCCESS */}
        <Modal transparent visible={showSuccess}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.successSheet,
                { backgroundColor: colors.card },
              ]}
            >
              <Image source={successOwl} style={styles.owlImage} />

              <Text
                style={[
                  styles.successTitle,
                  { color: colors.text },
                ]}
              >
                Transfer Successful!
              </Text>

              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    From
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {selectedPocket?.name}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    To
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    Safe Balance
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    Amount
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    ₱{transferredAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    Date
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {transferDate}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccess(false);
                  router.replace('/home');
                }}
              >
                <Text style={styles.modalButtonText}>
                  Go to Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ERROR */}
        <Modal transparent visible={showError}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.successSheet,
                { backgroundColor: colors.card },
              ]}
            >
              <Image source={unsuccessfulOwl} style={styles.owlImage} />

              <Text
                style={[
                  styles.errorTitle,
                  { color: colors.text },
                ]}
              >
                Transfer Unsuccessful
              </Text>

              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={{ color: colors.text }}>
                  {error}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowError(false)}
              >
                <Text style={styles.modalButtonText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeWrapper>
  );
}
