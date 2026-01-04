import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();

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
    <ThemeWrapper>
      <View
        style={[
          styles.safeArea,
          { backgroundColor: colors.background },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[
            styles.container,
            { backgroundColor: colors.background },
          ]}
        >
          {/* DESTINATION */}
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text },
            ]}
          >
            Add Funds
          </Text>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowDestinationDropdown(true)}
          >
            <Text
              style={[
                styles.dropdownSelectedText,
                { color: colors.text },
              ]}
            >
              {selectedDestination === 'safe_balance'
                ? 'Safe Balance'
                : selectedPocket
                ? getPocketName(selectedPocket)
                : 'Select Pocket'}
            </Text>
            <Icon
              name="chevron-down"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* AMOUNT */}
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text },
            ]}
          >
            Amount
          </Text>

          <View
            style={[
              styles.amountInputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.currencySymbol,
                { color: colors.text },
              ]}
            >
              ₱
            </Text>
            <TextInput
              style={[
                styles.amountInput,
                { color: colors.text },
              ]}
              value={fundAmount}
              onChangeText={handleFundAmountChange}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* BUTTON — untouched */}
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
            <View
              style={[
                styles.dropdownModal,
                { backgroundColor: colors.card },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedDestination('safe_balance');
                  setSelectedPocket(null);
                  setShowDestinationDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItem,
                    { color: colors.text },
                  ]}
                >
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
                <Text
                  style={[
                    styles.dropdownItem,
                    { color: colors.text },
                  ]}
                >
                  Pocket
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setShowDestinationDropdown(false)
                }
              >
                <Text
                  style={[
                    styles.dropdownCancel,
                    { color: colors.textMuted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* POCKET MODAL */}
        <Modal transparent visible={showPocketDropdown}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.dropdownModal,
                { backgroundColor: colors.card },
              ]}
            >
              {pockets.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    setSelectedPocket(p.id);
                    setShowPocketDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItem,
                      { color: colors.text },
                    ]}
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() =>
                  setShowPocketDropdown(false)
                }
              >
                <Text
                  style={[
                    styles.dropdownCancel,
                    { color: colors.textMuted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SUCCESS MODAL */}
        <Modal transparent visible={showSuccessModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.successModalContent,
                { backgroundColor: colors.card },
              ]}
            >
              <Image
                source={require('../../assets/successOwl.png')}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: 'contain',
                  marginBottom: 12,
                }}
              />

              <Text
                style={[
                  styles.successTitle,
                  { color: colors.text },
                ]}
              >
                Top up Successful!
              </Text>

              {successTransaction && (
                <View
                  style={[
                    styles.transactionDetailsBox,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <View style={styles.transactionDetailRow}>
                    <Text
                      style={[
                        styles.transactionDetailLabel,
                        { color: colors.textMuted },
                      ]}
                    >
                      Transferred to
                    </Text>
                    <Text
                      style={[
                        styles.transactionDetailValue,
                        { color: colors.text },
                      ]}
                    >
                      {
                        successTransaction.destinationName
                      }
                    </Text>
                  </View>

                  <View style={styles.transactionDetailRow}>
                    <Text
                      style={[
                        styles.transactionDetailLabel,
                        { color: colors.textMuted },
                      ]}
                    >
                      Amount
                    </Text>
                    <Text
                      style={[
                        styles.transactionDetailValue,
                        { color: colors.text },
                      ]}
                    >
                      ₱
                      {successTransaction.amount.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.transactionDetailRow}>
                    <Text
                      style={[
                        styles.transactionDetailLabel,
                        { color: colors.textMuted },
                      ]}
                    >
                      Date
                    </Text>
                    <Text
                      style={[
                        styles.transactionDetailValue,
                        { color: colors.text },
                      ]}
                    >
                      {new Date(
                        successTransaction.date
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}

              {/* BUTTON — untouched */}
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
      </View>
    </ThemeWrapper>
  );
};

export default AddFundsScreen;
