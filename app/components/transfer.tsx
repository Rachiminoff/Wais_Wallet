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

import styles from '../styles/transferStyles';
import { Packet } from '../types';
import {
    getPockets,
    getUser,
    transferFunds,
    saveUser,
    savePockets,
} from '../utils/mmkvStorage';

/* ASSETS */
const successOwl = require('../../assets/successOwl.png');
const unsuccessfulOwl = require('../../assets/unsuccessfulOwl.png');

export default function TransferScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [user, setUser] = useState(getUser());
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [fromPocket, setFromPocket] = useState<string | null>(null);
  const [toPocket, setToPocket] = useState<string | null>(null);

  const [amount, setAmount] = useState('');
  const [transferredAmount, setTransferredAmount] = useState(0);
  const [error, setError] = useState('');

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [transferDate, setTransferDate] = useState('');
  const [newFromBalance, setNewFromBalance] = useState(0);
  const [newToBalance, setNewToBalance] = useState(0);

  /* LOAD DATA */
  useEffect(() => {
    const pocketData = getPockets();
    setPockets(pocketData);
    setUser(getUser());
  }, []);

  /* HELPERS */
  const getSourceName = (id: string | null) => {
    if (!id) return ' - Select - ';
    if (id === 'safe_balance') return 'Safe Balance';
    return pockets.find(p => p.id === id)?.name || '';
  };

  const getSourceAmount = (id: string | null) => {
    if (!id) return 0;
    if (id === 'safe_balance') return user?.balance ?? 0;
    return pockets.find(p => p.id === id)?.amount ?? 0;
  };

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
      if (!fromPocket) {
        throw new Error('Please select a source');
      }

      if (!toPocket) {
        throw new Error('Please select a destination');
      }

      if (fromPocket === toPocket) {
        throw new Error('Cannot transfer to the same pocket');
      }

      const value = Number(amount);

      if (!value || value <= 0) {
        throw new Error('Invalid transfer amount');
      }

      const sourceBalance = getSourceAmount(fromPocket);
      if (value > sourceBalance) {
        throw new Error('Insufficient balance');
      }

      // Calculate new balances for preview
      setNewFromBalance(sourceBalance - value);
      setNewToBalance(getSourceAmount(toPocket) + value);
      
      // Show confirmation modal instead of executing transfer
      setShowConfirmModal(true);
    } catch (err: any) {
      setError(err.message);
      setShowError(true);
    }
  };

  const confirmTransfer = () => {
    try {
      const value = Number(amount);

      // Perform transfer based on from/to
      if (fromPocket === 'safe_balance' && toPocket !== 'safe_balance') {
        // Transfer from safe balance to pocket: deduct from balance, add to pocket
        const user = getUser();
        if (!user) throw new Error('No user');
        if (value > user.balance) throw new Error('Insufficient safe balance');
        
        user.balance -= value;
        saveUser(user);
        
        const { addFundsToPocket } = require('../utils/mmkvStorage');
        addFundsToPocket(toPocket, value);
      } else if (fromPocket !== 'safe_balance' && toPocket === 'safe_balance') {
        // Transfer from pocket to safe balance
        transferFunds(fromPocket, value);
      } else if (fromPocket !== 'safe_balance' && toPocket !== 'safe_balance') {
        // Transfer between pockets: withdraw from source, add to destination
        const pockets = getPockets();
        const fromIndex = pockets.findIndex(p => p.id === fromPocket);
        if (fromIndex === -1) throw new Error('Source pocket not found');
        if (pockets[fromIndex].amount < value) throw new Error('Insufficient funds');
        
        pockets[fromIndex].amount -= value;
        savePockets(pockets);
        
        const { addFundsToPocket } = require('../utils/mmkvStorage');
        addFundsToPocket(toPocket, value);
      }

      setTransferredAmount(value);
      setTransferDate(new Date().toLocaleDateString());

      setShowConfirmModal(false);
      setShowSuccess(true);
      setAmount('');

      setPockets(getPockets());
      setUser(getUser());
    } catch (err: any) {
      setShowConfirmModal(false);
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
          { backgroundColor: colors.background, paddingTop: 50 },
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
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text, marginTop: 30 },
          ]}
        >
          Transfer
        </Text>

        {/* FROM */}
        <View style={[styles.formGroup, showFromDropdown && { marginBottom: 0 }]}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            From
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderBottomLeftRadius: showFromDropdown ? 0 : 10,
                borderBottomRightRadius: showFromDropdown ? 0 : 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
            onPress={() => setShowFromDropdown(!showFromDropdown)}
          >
            <Text
              style={[
                { color: fromPocket ? colors.text : colors.muted, fontSize: 15 },
              ]}
            >
              {getSourceName(fromPocket)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={[
                  { color: colors.text, fontSize: 15, fontWeight: '600' },
                ]}
              >
                {fromPocket ? `₱${getSourceAmount(fromPocket).toFixed(2)}` : ''}
              </Text>
              <Icon
                name={showFromDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>

          {/* FROM DROPDOWN MENU */}
          {showFromDropdown && (
            <View
              style={[
                styles.dropdownMenu,
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
                style={styles.dropdownItem}
                onPress={() => {
                  setFromPocket('safe_balance');
                  setShowFromDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.text },
                  ]}
                >
                  Safe Balance
                </Text>
                <Text
                  style={[
                    styles.dropdownItemAmount,
                    { color: colors.text },
                  ]}
                >
                  ₱{(user?.balance ?? 0).toFixed(2)}
                </Text>
              </TouchableOpacity>
              {pockets.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFromPocket(p.id);
                    setShowFromDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: colors.text },
                    ]}
                  >
                    {p.name}
                  </Text>
                  <Text
                    style={[
                      styles.dropdownItemAmount,
                      { color: colors.text },
                    ]}
                  >
                    ₱{p.amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        </View>

        {/* TO */}
        <View style={[styles.formGroup, showToDropdown && { marginBottom: 0 }]}>
          <Text
            style={[
              styles.label,
              { color: '#000', fontWeight: '700', fontSize: 15 },
            ]}
          >
            To
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderBottomLeftRadius: showToDropdown ? 0 : 10,
                borderBottomRightRadius: showToDropdown ? 0 : 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
            onPress={() => setShowToDropdown(!showToDropdown)}
          >
            <Text
              style={[
                { color: toPocket ? colors.text : colors.muted, fontSize: 15 },
              ]}
            >
              {getSourceName(toPocket)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={[
                  { color: colors.text, fontSize: 15, fontWeight: '600' },
                ]}
              >
                {toPocket ? `₱${getSourceAmount(toPocket).toFixed(2)}` : ''}
              </Text>
              <Icon
                name={showToDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>

          {/* TO DROPDOWN MENU */}
          {showToDropdown && (
            <View
              style={[
                styles.dropdownMenu,
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
                style={styles.dropdownItem}
                onPress={() => {
                  setToPocket('safe_balance');
                  setShowToDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.text },
                  ]}
                >
                  Safe Balance
                </Text>
                <Text
                  style={[
                    styles.dropdownItemAmount,
                    { color: colors.text },
                  ]}
                >
                  ₱{(user?.balance ?? 0).toFixed(2)}
                </Text>
              </TouchableOpacity>
              {pockets.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setToPocket(p.id);
                    setShowToDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: colors.text },
                    ]}
                  >
                    {p.name}
                  </Text>
                  <Text
                    style={[
                      styles.dropdownItemAmount,
                      { color: colors.text },
                    ]}
                  >
                    ₱{p.amount.toFixed(2)}
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
            Transfer Amount
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

        {/* CONFIRM MODAL */}
        <Modal transparent visible={showConfirmModal} animationType="fade">
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successSheet,
                { 
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
                  paddingHorizontal: 30,
                  paddingVertical: 40,
                },
              ]}
            >
              <Text
                style={[
                  styles.successTitle,
                  { color: colors.text, marginBottom: 16 },
                ]}
              >
                Confirm Transfer
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
                This will transfer funds between your pockets. Are you sure?
              </Text>

              {/* Details Preview */}
              <View style={{ width: '100%', marginBottom: 30, backgroundColor: colors.background, padding: 16, borderRadius: 12 }}>
                <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    From: {getSourceName(fromPocket)}
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>
                    ₱{getSourceAmount(fromPocket).toFixed(2)} → ₱{newFromBalance.toFixed(2)}
                  </Text>
                </View>

                <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    To: {getSourceName(toPocket)}
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>
                    ₱{getSourceAmount(toPocket).toFixed(2)} → ₱{newToBalance.toFixed(2)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Transfer Amount</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                    ₱{amount}
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
                  onPress={confirmTransfer}
                >
                  <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* SUCCESS */}
        <Modal transparent visible={showSuccess}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successSheet,
                { 
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
                },
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
                    {getSourceName(fromPocket)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    New Balance
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    ₱{newFromBalance.toFixed(2)}
                  </Text>
                </View>

                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    To
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {getSourceName(toPocket)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                    New Balance
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    ₱{newToBalance.toFixed(2)}
                  </Text>
                </View>

                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />

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
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <View
              style={[
                styles.successSheet,
                { 
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  width: '85%',
                  maxWidth: 400,
                },
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
