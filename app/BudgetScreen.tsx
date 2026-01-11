// BudgetScreen.tsx

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useTheme } from './context/ThemeContext';
import styles from './styles/budgetStyles';
import { Packet, User } from './types';
import { getPockets, getUser, allocateFromSafeToPocket, getTransactions } from './utils/mmkvStorage';

export default function BudgetScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingBalance, setEditingBalance] = useState(false);
  const [editedBalance, setEditedBalance] = useState('');
  const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
  const [showConfirmBalanceModal, setShowConfirmBalanceModal] = useState(false);
  const [showSuccessBalanceModal, setShowSuccessBalanceModal] = useState(false);

  const [selectedPocketForAllocation, setSelectedPocketForAllocation] = useState<Packet | null>(null);
  const [allocationAmount, setAllocationAmount] = useState('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAllocateConfirmModal, setShowAllocateConfirmModal] = useState(false);
  const [showAllocateSuccessModal, setShowAllocateSuccessModal] = useState(false);

  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  /* ====================
     LOAD DATA
  ==================== */
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        const loadedUser = getUser();
        if (!loadedUser) {
          router.replace('/login');
          return;
        }

        setUser(loadedUser);
        setPockets(getPockets());
      } catch (err) {
        Alert.alert('Error', 'Failed to load budget data');
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    }, [])
  );

  /* ====================
     LOADING STATE
  ==================== */
  if (isLoading || !user) {
    return (
      <ThemeWrapper>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.muted }}>Loading...</Text>
        </View>
      </ThemeWrapper>
    );
  }

  /* ====================
     BALANCE EDIT HANDLERS
  ==================== */
  const hasBalanceChanges = () => {
    return user && Number(editedBalance) !== user.balance;
  };

  const proceedToConfirmBalance = () => {
    const value = Number(editedBalance);

    if (isNaN(value) || value < 0) {
      Alert.alert('Invalid amount');
      return;
    }

    setShowEditBalanceModal(false);
    setShowConfirmBalanceModal(true);
  };

  const handleSaveBalance = () => {
    if (!user) return;

    try {
      const { saveUser, getTransactions } = require('./utils/mmkvStorage');
      const oldBalance = user.balance;
      const newBalance = Number(editedBalance);
      const diff = newBalance - oldBalance;
      
      const updatedUser = {
        ...user,
        balance: newBalance,
      };
      
      saveUser(updatedUser);

      // Record transaction
      const storage = require('react-native-mmkv').createMMKV();
      const txs = getTransactions();
      const tx = {
        id: `tx_${Date.now()}`,
        type: 'ADD_FUNDS',
        amount: Math.abs(diff),
        description: `Edited Safe Balance (${diff > 0 ? '+' : diff < 0 ? '-' : '±'}₱${Math.abs(diff).toFixed(2)})`,
        createdAt: new Date().toISOString(),
      };
      storage.set('transactions_data', JSON.stringify([tx, ...txs]));
      
      setUser(updatedUser);
      setShowConfirmBalanceModal(false);
      setShowSuccessBalanceModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to update balance');
    }
  };

  /* ====================
     ALLOCATION HANDLERS
  ==================== */
  const getPocketHealthColor = (amount: number) => {
    if (amount === 0) return colors.muted;
    return colors.icon;
  };

  const handleAllocateClick = (pocket: Packet) => {
    setSelectedPocketForAllocation(pocket);
    setAllocationAmount('');
    setShowAllocateModal(true);
  };

  const proceedToConfirmAllocation = () => {
    const amount = Number(allocationAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount');
      return;
    }

    if (user && amount > user.balance) {
      Alert.alert('Insufficient funds', 'Your safe balance is not enough');
      return;
    }

    setShowAllocateModal(false);
    setShowAllocateConfirmModal(true);
  };

  const handleAllocate = () => {
    if (!user || !selectedPocketForAllocation) return;

    try {
      allocateFromSafeToPocket(selectedPocketForAllocation.id, Number(allocationAmount));

      // Reload data
      const updatedUser = getUser();
      const updatedPockets = getPockets();
      setUser(updatedUser);
      setPockets(updatedPockets);

      setShowAllocateConfirmModal(false);
      setShowAllocateSuccessModal(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  /* ====================
     UI
  ==================== */
  return (
    <ThemeWrapper>
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: font.family,
              paddingBottom: 15
            },
          ]}
        >
          Budget Planner
        </Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 }, // space for navbar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ACTION BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/components/addFunds')}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { fontFamily: font.family },
              ]}
            >
              Add Funds
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/components/addPocket')}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { fontFamily: font.family },
              ]}
            >
              Add Pocket
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { flex: 0.8 }]}
            onPress={() => setShowTransactionsModal(true)}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { fontFamily: font.family },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* SAFE BALANCE */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                styles.cardLabel,
                { color: colors.text, fontFamily: font.family },
              ]}
            >
              Safe Balance{' '}
              <Text style={{ color: colors.muted }}>(Not Allocated)</Text>
            </Text>

            <TouchableOpacity
              onPress={() => {
                setEditingBalance(true);
                setEditedBalance(String(user.balance));
                setShowEditBalanceModal(true);
              }}
              hitSlop={15}
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Icon
                name="pencil-sharp"
                size={18}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.balanceText,
              { color: colors.text, fontFamily: font.family },
            ]}
          >
            ₱
            {user.balance.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        {/* POCKETS */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.pocketHeader}>
            <Text style={[styles.cardLabel, { color: colors.text }]}>
              Pockets <Text style={{ color: colors.muted, fontSize: 12 }}>(tap to allocate)</Text>
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/components/EditPocketScreen')}
              disabled={pockets.length === 0}
            >
              <Icon
                name="pencil-sharp"
                size={18}
                color={pockets.length === 0 ? colors.muted : colors.icon}
              />
            </TouchableOpacity>
          </View>

          {pockets.length === 0 && (
            <Text style={{ color: colors.muted }}>No pockets yet</Text>
          )}

          {pockets.map(pocket => {
            const amount = Number(pocket.amount ?? 0);

            const amountColor =
              pocket.name?.toLowerCase() === 'savings'
                ? colors.primary
                : amount === 0
                ? colors.muted
                : colors.text;

            return (
              <TouchableOpacity
                key={pocket.id}
                style={[
                  styles.pocketRow,
                  {
                    backgroundColor: colors.background,
                    borderLeftWidth: 4,
                    borderLeftColor: getPocketHealthColor(amount),
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    marginBottom: 8,
                    borderRadius: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => handleAllocateClick(pocket)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pocketName, { color: colors.text }]}>
                    {pocket.name}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text
                    style={[styles.pocketAmount, { color: amountColor }]}
                  >
                    ₱
                    {amount.toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                  <Icon
                    name="chevron-forward"
                    size={16}
                    color={colors.muted}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* EDIT BALANCE MODAL */}
      <Modal transparent visible={showEditBalanceModal} animationType="fade">
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <View style={[
            { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }
          ]}>
            <View style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 24,
              width: '85%',
              maxWidth: 400,
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 18, color: colors.text }}>
                Edit Safe Balance
              </Text>

              <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 8, fontWeight: '600' }}>
                Amount
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
                keyboardType="numeric"
                value={editedBalance}
                onChangeText={setEditedBalance}
              />

              <View style={{
                backgroundColor: colors.background,
                padding: 14,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: colors.icon,
                marginVertical: 16,
              }}>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
                  Note: This directly changes your safe balance without affecting pockets.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 0, gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowEditBalanceModal(false)}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0f4248',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: hasBalanceChanges() ? 1 : 0.5,
                  }}
                  disabled={!hasBalanceChanges()}
                  onPress={proceedToConfirmBalance}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* CONFIRM BALANCE MODAL */}
      <Modal transparent visible={showConfirmBalanceModal} animationType="fade">
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
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
              color: colors.text,
              textAlign: 'center',
            }}>
              Confirm Changes
            </Text>

            <View style={{
              backgroundColor: colors.background,
              padding: 14,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#0f4248',
              marginBottom: 24,
            }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  Safe Balance
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  ₱{user?.balance.toFixed(2)} → ₱{Number(editedBalance).toFixed(2)}
                </Text>
              </View>

              <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 16 }}>
                Note: This directly changes your safe balance without affecting pockets.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.border,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => setShowConfirmBalanceModal(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#0f4248',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={handleSaveBalance}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SUCCESS BALANCE MODAL */}
      <Modal transparent visible={showSuccessBalanceModal} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            width: '85%',
            maxWidth: 400,
            alignItems: 'center',
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}>
            <Image
              source={require('../assets/successOwl.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginBottom: 12,
              }}
            />

            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 24,
              color: colors.text,
              textAlign: 'center',
            }}>
              Balance Updated!
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#1C2B3A',
                paddingVertical: 14,
                paddingHorizontal: 30,
                borderRadius: 12,
                width: '80%',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowSuccessBalanceModal(false);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ALLOCATE FROM SAFE MODAL */}
      <Modal transparent visible={showAllocateModal} animationType="fade">
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 24,
              width: '85%',
              maxWidth: 400,
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: colors.text }}>
                Allocate to {selectedPocketForAllocation?.name}
              </Text>

              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 18, fontWeight: '500' }}>
                From Safe Balance: ₱{user?.balance.toFixed(2)}
              </Text>

              <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 8, fontWeight: '600' }}>
                Amount to Allocate
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  backgroundColor: colors.background,
                  color: colors.text,
                }}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                value={allocationAmount}
                onChangeText={setAllocationAmount}
              />

              <View style={{
                backgroundColor: colors.background,
                padding: 14,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: colors.icon,
                marginVertical: 16,
              }}>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
                  This moves funds from your Safe Balance to this pocket.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowAllocateModal(false)}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0f4248',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  disabled={!allocationAmount || Number(allocationAmount) <= 0}
                  onPress={proceedToConfirmAllocation}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* CONFIRM ALLOCATION MODAL */}
      <Modal transparent visible={showAllocateConfirmModal} animationType="fade">
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
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
              color: colors.text,
              textAlign: 'center',
            }}>
              Confirm Allocation
            </Text>

            <View style={{
              backgroundColor: colors.background,
              padding: 14,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#0f4248',
              marginBottom: 24,
            }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  Safe Balance
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  ₱{user?.balance.toFixed(2)} → ₱{Number((user?.balance ?? 0) - Number(allocationAmount)).toFixed(2)}
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  {selectedPocketForAllocation?.name}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary }}>
                  ₱{Number(selectedPocketForAllocation?.amount ?? 0).toFixed(2)} → ₱{Number((selectedPocketForAllocation?.amount ?? 0) + Number(allocationAmount)).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.border,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => setShowAllocateConfirmModal(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#0f4248',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={handleAllocate}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ALLOCATION SUCCESS MODAL */}
      <Modal transparent visible={showAllocateSuccessModal} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            width: '85%',
            maxWidth: 400,
            alignItems: 'center',
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}>
            <Image
              source={require('../assets/successOwl.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginBottom: 12,
              }}
            />

            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8,
              color: colors.text,
              textAlign: 'center',
            }}>
              Allocated Successfully!
            </Text>

            <Text style={{
              fontSize: 13,
              color: colors.muted,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              ₱{Number(allocationAmount).toFixed(2)} added to {selectedPocketForAllocation?.name}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#0f4248',
                paddingVertical: 14,
                paddingHorizontal: 30,
                borderRadius: 12,
                width: '80%',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowAllocateSuccessModal(false);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TRANSACTIONS HISTORY MODAL */}
      <Modal transparent visible={showTransactionsModal} animationType="slide">
        <ThemeWrapper>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
              backgroundColor: colors.card,
              paddingTop: 50,
              paddingBottom: 16,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                  Transaction History
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTransactionsModal(false)}
                  hitSlop={15}
                >
                  <Icon name="close" size={24} color={colors.icon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Transactions List */}
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {getTransactions().length === 0 ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                  <Text style={{ color: colors.muted, fontSize: 14 }}>No transactions yet</Text>
                </View>
              ) : (
                getTransactions().slice(0, 50).map((tx) => {
                  const isEdit = tx.type === 'SAVINGS_EDIT' || tx.description.toLowerCase().includes('edit');
                  const isIncome = (tx.type === 'ADD_FUNDS' || tx.type === 'POCKET_ADD_FUNDS') && !isEdit;
                  const borderColor = isEdit ? '#FF8C00' : isIncome ? colors.primary : '#FF6B6B';
                  const amountColor = isEdit ? '#FF8C00' : isIncome ? colors.primary : '#FF6B6B';
                  const prefix = isEdit ? '~' : isIncome ? '+' : '-';
                  
                  return (
                    <View
                      key={tx.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 10,
                        borderLeftWidth: 4,
                        borderLeftColor: borderColor,
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4, fontSize: 13 }}>
                            {tx.description}
                          </Text>
                          <Text style={{ color: colors.muted, fontSize: 12 }}>
                            {new Date(tx.createdAt).toLocaleDateString('en-PH')}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: amountColor,
                            fontWeight: '600',
                            fontSize: 13,
                          }}
                        >
                          {prefix}₱{tx.amount.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </ThemeWrapper>
      </Modal>

      {/* BOTTOM NAV (REUSABLE COMPONENT) */}
      <BottomNavbar />
    </ThemeWrapper>
  );
}


