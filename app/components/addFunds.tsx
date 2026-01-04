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
  subtractFromBalance,
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
    useState<DestinationType | 'subtract'>('safe_balance');

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

  /* ERROR BOTTOM SHEET */
  const [showErrorModal, setShowErrorModal] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState('');

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
     TRANSACTION LOGIC
  ==================== */
  const handleTransaction = (
    amount: number,
    destination: DestinationType | 'subtract',
    pocketId?: string
  ): Transaction => {
    if (destination === 'safe_balance') {
      addToBalance(amount);
    }

    if (destination === 'pocket') {
      if (!pocketId)
        throw new Error('No pocket selected');
      addFundsToPocket(pocketId, amount);
    }

    if (destination === 'subtract') {
      subtractFromBalance(amount);
    }

    return {
      amount,
      destination,
      destinationName:
        destination === 'safe_balance'
          ? 'Safe Balance'
          : destination === 'subtract'
          ? 'Spent from Safe Balance'
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
      setErrorMessage(validation.message);
      setShowErrorModal(true);
      return;
    }

    if (
      selectedDestination === 'pocket' &&
      !selectedPocket
    ) {
      setErrorMessage('Please choose a pocket.');
      setShowErrorModal(true);
      return;
    }

    try {
      const tx = handleTransaction(
        validation.amount!,
        selectedDestination,
        selectedPocket || undefined
      );

      setSuccessTransaction(tx);
      setShowSuccessModal(true);

      setUser(getUser());
      setPockets(getPockets());
    } catch (e: any) {
      setErrorMessage(
        e.message ||
          'You cannot subtract this amount because your account will result in a negative balance.'
      );
      setShowErrorModal(true);
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
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text },
            ]}
          >
            Transaction Type
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
                ? 'Add to Safe Balance'
                : selectedDestination === 'subtract'
                ? 'Subtract Funds'
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

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleSubmit}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* DESTINATION DROPDOWN */}
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
                  Add to Safe Balance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedDestination('subtract');
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
                  Subtract Funds
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

        {/* POCKET DROPDOWN */}
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

        {/* ERROR BOTTOM SHEET */}
        <Modal transparent visible={showErrorModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.successModalContent,
                {
                  backgroundColor: colors.card,
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                },
              ]}
            >
              <Image
                source={require('../../assets/unsuccessfulOwl.png')}
                style={{
                  width: 100,
                  height: 100,
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
                Transaction Failed
              </Text>

              <Text
                style={{
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                {errorMessage}
              </Text>

              <TouchableOpacity
                style={styles.goHomeButton}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.goHomeButtonText}>
                  Got it
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
                Transaction Successful!
              </Text>

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
