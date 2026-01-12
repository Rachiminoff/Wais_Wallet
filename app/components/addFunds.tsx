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
} from '../utils/mmkvStorage';

const AddFundsScreen: React.FC = () => {
  const router = useRouter();
  const { colors, font } = useTheme();

  /* ====================
     STATE
  ==================== */
  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);

  const [selectedDestination, setSelectedDestination] =
    useState<DestinationType | null>(null);

  const [selectedPocketId, setSelectedPocketId] =
    useState<string | null>(null);

  const [fundAmount, setFundAmount] = useState('');
  const [note, setNote] = useState('');

  const [showDestinationDropdown, setShowDestinationDropdown] =
    useState(false);

  const [successTransaction, setSuccessTransaction] =
    useState<Transaction | null>(null);
  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const [amountFocused, setAmountFocused] = useState(false);

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

  const getDestinationBalance = () => {
    if (selectedDestination === 'safe_balance') {
      return user?.balance ?? 0;
    }
    if (selectedDestination === 'pocket' && selectedPocketId) {
      return pockets.find(p => p.id.toString() === selectedPocketId)?.amount ?? 0;
    }
    return 0;
  };

  const getDestinationName = () => {
    if (selectedDestination === 'safe_balance') {
      return 'Safe Balance';
    }
    if (selectedDestination === 'pocket' && selectedPocketId) {
      return getPocketName(selectedPocketId);
    }
    return '';
  };

  const handleFundAmountChange = (text: string) => {
    setFundAmount(formatInputAmount(text));
  };

  /* ====================
     TRANSACTION LOGIC
  ==================== */
  const handleTransaction = (
    amount: number,
    destination: DestinationType,
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
      setErrorMessage(validation.message);
      setShowErrorModal(true);
      return;
    }

    if (
      selectedDestination === 'pocket' &&
      !selectedPocketId
    ) {
      setErrorMessage('Please choose a pocket.');
      setShowErrorModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmTransaction = () => {
    const validation = validateAmount(fundAmount);
    if (!validation.isValid) return;

    try {
      const tx = handleTransaction(
        validation.amount!,
        selectedDestination,
        selectedPocketId || undefined
      );

      setSuccessTransaction(tx);
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      setUser(getUser());
      setPockets(getPockets());
    } catch (e: any) {
      setErrorMessage(
        e.message ||
          'An error occurred while processing the transaction.'
      );
      setShowConfirmModal(false);
      setShowErrorModal(true);
    }
  };

  const isAmountValid = Number(fundAmount) > 0 && selectedDestination !== null;

  /* ====================
     UI
  ==================== */
  return (
    <ThemeWrapper>
      <View
        style={[
          styles.safeArea,
          { backgroundColor: colors.background, paddingTop: 50 },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity 
            onPress={() => router.back()}
          >
            <Icon
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: font + 4, fontWeight: '700' },
            ]}
          >
            Add Funds
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* DISCLAIMER */}
        <View style={{ 
          paddingHorizontal: 20, 
          marginBottom: 20,
          marginTop: 8,
        }}>
          <View style={{
            backgroundColor: '#f0f9ff',
            padding: 16,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#bae6fd',
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#0284c7',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}>
            <Text style={{ fontSize: 18, marginRight: 12 }}>💰</Text>
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: '#0c4a6e',
                lineHeight: 19,
                fontWeight: '500',
              }}
            >
              Adding funds is for topping up your balance. It does not deduct from any pocket.
            </Text>
          </View>
        </View>

        {/* SELECT POCKET */}
        <View style={[styles.formGroup, showDestinationDropdown && { marginBottom: 0 }]}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            Select Pocket
          </Text>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderBottomLeftRadius: showDestinationDropdown ? 0 : 10,
                borderBottomRightRadius: showDestinationDropdown ? 0 : 10,
              },
            ]}
            onPress={() => setShowDestinationDropdown(!showDestinationDropdown)}
          >
            <Text
              style={[
                styles.dropdownSelectedText,
                { color: selectedDestination === 'safe_balance' || (selectedDestination === 'pocket' && selectedPocketId) ? colors.text : colors.muted },
              ]}
            >
              {selectedDestination === 'safe_balance'
                ? 'Safe Balance'
                : selectedDestination === 'pocket' && selectedPocketId
                ? getPocketName(selectedPocketId)
                : ' - Select - '}
            </Text>
            <Icon
              name={showDestinationDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* DROPDOWN MENU */}
          {showDestinationDropdown && (
            <View
              style={[
                styles.dropdownList,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <ScrollView
                style={styles.dropdownScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <TouchableOpacity
                  style={styles.dropdownListItem}
                  onPress={() => {
                    setSelectedDestination('safe_balance');
                    setSelectedPocketId(null);
                    setShowDestinationDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownListItemText, { color: colors.text }]}>
                    Safe Balance
                  </Text>
                  <Text style={[styles.dropdownListItemAmount, { color: colors.text }]}>
                    ₱{(user?.balance ?? 0).toFixed(2)}
                  </Text>
                </TouchableOpacity>

                {pockets.map(pocket => (
                  <TouchableOpacity
                    key={pocket.id}
                    style={styles.dropdownListItem}
                    onPress={() => {
                      setSelectedDestination('pocket');
                      setSelectedPocketId(pocket.id.toString());
                      setShowDestinationDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownListItemText, { color: colors.text }]}>
                      {pocket.name}
                    </Text>
                    <Text style={[styles.dropdownListItemAmount, { color: colors.text }]}>
                      ₱{pocket.amount.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* AMOUNT */}
        <View style={styles.formGroup}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            Amount
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
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.textMuted}
            value={fundAmount}
            onChangeText={handleFundAmountChange}
            maxLength={60}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isAmountValid && { opacity: 0.5 },
          ]}
          disabled={!isAmountValid}
          onPress={handleSubmit}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        {/* CONFIRM MODAL */}
        <Modal transparent visible={showConfirmModal} animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 24,
              width: '85%',
              maxWidth: 400,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 20,
                color: colors.text,
                textAlign: 'center',
              }}>
                Confirm Transaction
              </Text>

              {/* Details Preview */}
              <View style={{
                backgroundColor: '#f8fafc',
                padding: 18,
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}>
                {selectedDestination === 'safe_balance' && (
                  <View style={{ 
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e2e8f0',
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      color: colors.muted, 
                      marginBottom: 6,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      Safe Balance
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748b' }}>
                        ₱{user?.balance.toFixed(2) || '0.00'}
                      </Text>
                      <Text style={{ marginHorizontal: 8, color: '#94a3b8', fontSize: 16 }}>→</Text>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f4248' }}>
                        ₱{((user?.balance || 0) + Number(fundAmount)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                {selectedDestination === 'pocket' && selectedPocketId && (
                  <View style={{ 
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e2e8f0',
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      color: colors.muted, 
                      marginBottom: 6,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      {getDestinationName()}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748b' }}>
                        ₱{getDestinationBalance().toFixed(2)}
                      </Text>
                      <Text style={{ marginHorizontal: 8, color: '#94a3b8', fontSize: 16 }}>→</Text>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f4248' }}>
                        ₱{(getDestinationBalance() + Number(fundAmount)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                <View>
                  <Text style={{ 
                    fontSize: 12, 
                    color: colors.muted, 
                    marginBottom: 6,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    Amount to Add
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#0f4248' }}>
                    +₱{fundAmount}
                  </Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    paddingVertical: 15,
                    borderRadius: 14,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                  }}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={{ color: '#475569', fontWeight: '600', fontSize: 15 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0f4248',
                    paddingVertical: 15,
                    borderRadius: 14,
                    alignItems: 'center',
                    shadowColor: '#0f4248',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  onPress={confirmTransaction}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ERROR BOTTOM SHEET */}
        <Modal transparent visible={showErrorModal}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successModalContent,
                {
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
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
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successModalContent,
                { 
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
                },
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

              {/* Transaction Details */}
              {successTransaction && (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                  }}
                >
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      Destination
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
                      {successTransaction.destinationName}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      Amount
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
                      ₱{successTransaction.amount.toFixed(2)}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      Date
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
                      {new Date(successTransaction.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.goHomeButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
              >
                <Text style={styles.goHomeButtonText}>
                  Done
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
