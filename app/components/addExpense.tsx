import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';

import { formatInputAmount, validateAmount } from '../scripts/home';
import styles from '../styles/addFundsStyle';

import {
  Packet,
  User,
} from '../types';

import {
  getPockets,
  getUser,
  addExpense,
} from '../utils/mmkvStorage';

const AddExpenseScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();

  /* ====================
     STATE
  ==================== */
  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);

  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedPocket, setSelectedPocket] = useState<string | null>(null);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [note, setNote] = useState('');

  const [showPocketDropdown, setShowPocketDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newBalance, setNewBalance] = useState(0);

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
  const getPocketName = (id: string) => {
    if (id === 'safe_balance') return 'Safe Balance';
    return pockets.find(p => p.id === id)?.name || '';
  };

  const getPocketAmount = (id: string | null) => {
    if (!id) return 0;
    if (id === 'safe_balance') return user?.balance ?? 0;
    return pockets.find(p => p.id === id)?.amount ?? 0;
  };

  const handleExpenseAmountChange = (text: string) => {
    setExpenseAmount(formatInputAmount(text));
  };

  /* ====================
     SUBMIT
  ==================== */
  const handleSubmit = () => {
    const validation = validateAmount(expenseAmount);

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setShowErrorModal(true);
      return;
    }

    if (!selectedPocket) {
      setErrorMessage('Please select a pocket');
      setShowErrorModal(true);
      return;
    }

    // Calculate new balance for preview
    const currentBalance = getPocketAmount(selectedPocket);
    const expenseValue = parseFloat(expenseAmount) || 0;
    setNewBalance(currentBalance - expenseValue);

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    try {
      if (!selectedPocket) throw new Error('No pocket selected');
      
      const amount = parseFloat(expenseAmount);
      const pocketName = getPocketName(selectedPocket);
      
      addExpense(amount, selectedPocket, pocketName, expenseDate, note || undefined);
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setUser(getUser());
      setPockets(getPockets());
    } catch (e: any) {
      setShowConfirmModal(false);
      setErrorMessage(e.message || 'Failed to add expense');
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
          { backgroundColor: colors.background, paddingTop: 30 },
        ]}
      >
        {/* HEADER */}
        <View style={[styles.header, { marginTop: 40 }]}>
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
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 24,
            }}
          >
            Add Expense
          </Text>

          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text },
            ]}>
            Amount
          </Text>

          <TextInput
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
                paddingVertical: 18,
                paddingHorizontal: 16,
              },
            ]}
            value={expenseAmount}
            onChangeText={handleExpenseAmountChange}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.muted}
          />

          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text },
            ]}
          >
            Pocket
          </Text>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowPocketDropdown(true)}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                style={[
                  styles.dropdownSelectedText,
                  { color: selectedPocket ? colors.text : colors.muted, flex: 1 },
                ]}
              >
                {selectedPocket ? getPocketName(selectedPocket) : 'Select Pocket'}
              </Text>
              {selectedPocket && (
                <Text
                  style={[
                    styles.dropdownSelectedText,
                    { color: colors.text, marginRight: 8 },
                  ]}
                >
                  ₱{getPocketAmount(selectedPocket).toFixed(2)}
                </Text>
              )}
            </View>
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
            Date
          </Text>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: colors.text, flex: 1 }}>
              {expenseDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Icon
              name="calendar-outline"
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
            Note (optional)
          </Text>

          <TextInput
            style={[
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                color: colors.text,
                padding: 16,
                minHeight: 100,
                textAlignVertical: 'top',
              },
            ]}
            placeholder="Enter note"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 40, marginBottom: 60 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.card,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => router.back()}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#1C2B3A',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
              onPress={handleSubmit}
            >
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* CONFIRMATION MODAL */}
        <Modal transparent visible={showConfirmModal}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successModalContent,
                { 
                  backgroundColor: colors.card, 
                  paddingHorizontal: 30, 
                  paddingVertical: 40,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
                },
              ]}
            >
              <Text
                style={[
                  styles.successTitle,
                  { color: colors.text, marginBottom: 16 },
                ]}
              >
                Confirm Changes
              </Text>

              <Text
                style={{
                  color: colors.text,
                  textAlign: 'center',
                  fontSize: 14,
                  lineHeight: 20,
                  marginBottom: 24,
                }}
              >
                This will update your pocket balances and total budget immediately. Are you sure?
              </Text>

              {/* Details Preview */}
              <View style={{ width: '100%', marginBottom: 30, backgroundColor: colors.background, padding: 16, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>From</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    {selectedPocket ? getPocketName(selectedPocket) : ''}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>Amount</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    ₱{expenseAmount}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>New Balance</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    ₱{newBalance.toFixed(2)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>Date</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    {expenseDate.toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#1C2B3A',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={confirmSubmit}
                >
                  <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
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
              <TouchableOpacity
                key="safe_balance"
                onPress={() => {
                  setSelectedPocket('safe_balance');
                  setShowPocketDropdown(false);
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
              
              {pockets.map((pocket) => (
                <TouchableOpacity
                  key={pocket.id}
                  onPress={() => {
                    setSelectedPocket(pocket.id);
                    setShowPocketDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItem,
                      { color: colors.text },
                    ]}
                  >
                    {pocket.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowPocketDropdown(false)}
              >
                <Text
                  style={[
                    styles.dropdownCancel,
                    { color: colors.muted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* DATE PICKER MODAL */}
        {showDatePicker && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (event.type === 'set' && selectedDate) {
                setExpenseDate(selectedDate);
                if (Platform.OS === 'ios') {
                  setShowDatePicker(false);
                }
              } else if (event.type === 'dismissed') {
                setShowDatePicker(false);
              }
            }}
          />
        )}

        {/* ERROR BOTTOM SHEET */}
        <Modal transparent visible={showErrorModal}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successModalContent,
                {
                  backgroundColor: colors.card,
                  paddingHorizontal: 30,
                  paddingVertical: 40,
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
                Failed
              </Text>

              <Text
                style={{
                  color: colors.muted,
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
                  paddingHorizontal: 30,
                  paddingVertical: 40,
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
                Expense Added Successfully!
              </Text>

              {/* Details */}
              <View style={{ width: '100%', marginTop: 20, marginBottom: 30, backgroundColor: colors.background, padding: 16, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>From</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    {selectedPocket ? getPocketName(selectedPocket) : ''}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>Amount</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    ₱{expenseAmount}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>New Balance</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    ₱{newBalance.toFixed(2)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>Date</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    {expenseDate.toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.goHomeButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/expenses');
                }}
              >
                <Text style={styles.goHomeButtonText}>
                  Go to Expenses
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeWrapper>
  );
};

export default AddExpenseScreen;
