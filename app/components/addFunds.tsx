import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { formatInputAmount, validateAmount } from '../scripts/home';
import styles from '../styles/addFundsStyle';

import {
  DestinationType,
  Packet,
  Transaction,
  User,
} from '../types';

import {
  addFundsToPocket,
  addToBalance,
  getPockets,
  getUser,
} from '../utils/mmkvStorage';

const AddFundsScreen: React.FC = () => {
  const router = useRouter();

  /* ====================
     STATE
  ==================== */
  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);

  const [selectedDestination, setSelectedDestination] =
    useState<DestinationType>('safe_balance');
  const [selectedPocket, setSelectedPocket] =
    useState<string | null>(null);

  const [fundAmount, setFundAmount] = useState('');
  const [note, setNote] = useState('');

  const [showDestinationDropdown, setShowDestinationDropdown] =
    useState(false);
  const [showPocketDropdown, setShowPocketDropdown] =
    useState(false);

  const [successTransaction, setSuccessTransaction] =
    useState<Transaction | null>(null);
  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  /* ====================
     LOAD DATA
  ==================== */
  useEffect(() => {
    setUser(getUser());
    setPockets(getPockets());
  }, []);

  /* ====================
     HELPERS
  ==================== */
  const getPocketName = (id: string) =>
    pockets.find(p => p.id === id)?.name || '';

  const handleFundAmountChange = (text: string) => {
    setFundAmount(formatInputAmount(text));
  };

  /* ====================
     ADD FUNDS LOGIC
  ==================== */
  const addFunds = (
    amount: number,
    destination: DestinationType,
    pocketId?: string
  ): Transaction => {
    if (destination === 'safe_balance') {
      addToBalance(amount);
    }

    if (destination === 'pocket') {
      if (!pocketId) {
        throw new Error('No pocket selected');
      }
      addFundsToPocket(pocketId, amount);
    }

    return {
      amount,
      destination,
      destinationName:
        destination === 'safe_balance'
          ? 'Safe Balance'
          : getPocketName(pocketId!),
      date: new Date().toISOString(),
      note: note || undefined,
    };
  };

  /* ====================
     SUBMIT
  ==================== */
  const handleSubmit = () => {
    const validation = validateAmount(fundAmount);

    if (!validation.isValid) {
      return Alert.alert(
        'Invalid Amount',
        validation.message
      );
    }

    if (
      selectedDestination === 'pocket' &&
      !selectedPocket
    ) {
      return Alert.alert(
        'Select Pocket',
        'Please choose a pocket'
      );
    }

    try {
      const tx = addFunds(
        validation.amount!,
        selectedDestination,
        selectedPocket || undefined
      );

      setSuccessTransaction(tx);
      setShowSuccessModal(true);

      setUser(getUser());
      setPockets(getPockets());
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  /* ====================
     UI
  ==================== */
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#0f4248" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* DESTINATION */}
        <Text style={styles.sectionLabel}>Add Funds</Text>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDestinationDropdown(true)}
        >
          <Text style={styles.dropdownSelectedText}>
            {selectedDestination === 'safe_balance'
              ? 'Safe Balance'
              : selectedPocket
              ? getPocketName(selectedPocket)
              : 'Select Pocket'}
          </Text>
          <Icon name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* AMOUNT */}
        <Text style={styles.sectionLabel}>Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>₱</Text>
          <TextInput
            style={styles.amountInput}
            value={fundAmount}
            onChangeText={handleFundAmountChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        {/* NOTE */}
        <Text style={styles.sectionLabel}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSubmit}
        >
          <Text style={styles.continueButtonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DESTINATION MODAL */}
      <Modal transparent visible={showDestinationDropdown}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <TouchableOpacity
              onPress={() => {
                setSelectedDestination('safe_balance');
                setSelectedPocket(null);
                setShowDestinationDropdown(false);
              }}
            >
              <Text style={styles.dropdownItem}>
                Safe Balance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedDestination('pocket');
                setShowDestinationDropdown(false);
                setShowPocketDropdown(true);
              }}
            >
              <Text style={styles.dropdownItem}>
                Pocket
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setShowDestinationDropdown(false)
              }
            >
              <Text style={styles.dropdownCancel}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* POCKET MODAL */}
      <Modal transparent visible={showPocketDropdown}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            {pockets.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() => {
                  setSelectedPocket(p.id);
                  setShowPocketDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() =>
                setShowPocketDropdown(false)
              }
            >
              <Text style={styles.dropdownCancel}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={showSuccessModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Image
              source={require('../../assets/successOwl.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginBottom: 12,
              }}
            />

            <Text style={styles.successTitle}>
              Top up Successful!
            </Text>

            {successTransaction && (
              <View style={styles.transactionDetailsBox}>
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Transferred to
                  </Text>
                  <Text style={styles.transactionDetailValue}>
                    {successTransaction.destinationName}
                  </Text>
                </View>

                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Amount
                  </Text>
                  <Text style={styles.transactionDetailValue}>
                    ₱{successTransaction.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Date
                  </Text>
                  <Text style={styles.transactionDetailValue}>
                    {new Date(
                      successTransaction.date
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.goHomeButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/home');
              }}
            >
              <Text style={styles.goHomeButtonText}>
                Go to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddFundsScreen;
