import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/transferStyles';
import { Packet } from '../types';
import {
  getPockets,
  getUser,
  transferFunds,
} from '../utils/mmkvStorage';

/* ASSETS (CORRECT WAY) */
const successOwl = require('../../assets/successOwl.png');
const unsuccessfulOwl = require('../../assets/unsuccessfulOwl.png');

export default function TransferScreen() {
  const router = useRouter();

  const [user, setUser] = useState(getUser());
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [selectedPocket, setSelectedPocket] = useState<Packet | null>(null);

  const [amount, setAmount] = useState('');
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
      cleaned = parts[0] + '.' + parts.slice(1).join('');
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

      // ✅ MMKV TRANSFER
      transferFunds(selectedPocket.id, value);

      setTransferDate(new Date().toLocaleDateString());
      setShowSuccess(true);
      setAmount('');

      // refresh UI values
      setPockets(getPockets());
      setUser(getUser());
    } catch (err: any) {
      setError(err.message);
      setShowError(true);
    }
  };

  const numericAmount = Number(amount);
  const isAmountValid = numericAmount > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Transfer</Text>

      {/* FROM */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.label}>From</Text>
        <View style={styles.row}>
          <Text style={styles.boldText}>
            {selectedPocket?.name ?? '(Choose Pocket)'}
          </Text>
          <Text style={styles.amountText}>
            ₱{selectedPocket?.amount.toFixed(2) ?? '0.00'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* TO */}
      <View style={styles.card}>
        <Text style={styles.label}>To</Text>
        <View style={styles.row}>
          <Text style={styles.boldText}>Safe Balance</Text>
          <Text style={styles.amountText}>
            ₱{user?.balance.toFixed(2) ?? '0.00'}
          </Text>
        </View>
      </View>

      {/* AMOUNT */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Transfer amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Enter amount"
          value={amount}
          onChangeText={handleAmountChange}
        />
      </View>

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
      <Modal transparent visible={showPicker} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choose Pocket</Text>

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
                    <Text style={styles.optionName}>{p.name}</Text>
                    <Text style={styles.optionAmount}>
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
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS */}
      <Modal transparent visible={showSuccess} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successSheet}>
            <Image source={successOwl} style={styles.owlImage} />

            <Text style={styles.successTitle}>
              Transfer Successful!
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>From</Text>
                <Text style={styles.infoValue}>
                  {selectedPocket?.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>To</Text>
                <Text style={styles.infoValue}>Safe Balance</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Amount</Text>
                <Text style={styles.infoValue}>
                  ₱{numericAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{transferDate}</Text>
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
      <Modal transparent visible={showError} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successSheet}>
            <Image source={unsuccessfulOwl} style={styles.owlImage} />

            <Text style={styles.errorTitle}>
              Transfer Unsuccessful
            </Text>

            <View style={styles.infoBox}>
              <Text>{error}</Text>
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
    </SafeAreaView>
  );
}
