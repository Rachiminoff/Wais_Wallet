// HomeScreen.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';

import { AllocationHealthChart } from './components/AllocationHealthChart';
import { BottomNavbar } from './components/BottomNavbar';
import { useTheme } from './context/ThemeContext';
import { formatCurrencyDisplay } from './scripts/home';
import styles from './styles/HomeScreenStyles';

import { Packet, User } from './types';

import {
  getCurrentTotalBalance,
  getPockets,
  getSavings,
  getUser,
} from './utils/mmkvStorage';

const screenWidth = Dimensions.get('window').width;

/* ====================
   CONSTANTS
==================== */
const PIE_COLORS = [
  '#528d94',
  '#6fa8dc',
  '#93c47d',
  '#ffd966',
  '#e06666',
  '#8e7cc3',
];

/* ====================
   MAIN SCREEN
==================== */
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [savingsTotal, setSavingsTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [showTotalBalance, setShowTotalBalance] = useState(false);
  
  const [editingBalance, setEditingBalance] = useState(false);
  const [editedBalance, setEditedBalance] = useState('');
  const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
  const [showConfirmBalanceModal, setShowConfirmBalanceModal] = useState(false);
  const [showSuccessBalanceModal, setShowSuccessBalanceModal] = useState(false);

  /* ====================
     LOAD DATA (ON FOCUS)
  ==================== */
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        const storedUser = getUser();
        if (!storedUser) {
          router.replace('/login');
          return;
        }

        const storedPockets = getPockets();
        const storedSavings = getSavings();

        setUser(storedUser);
        setPockets(storedPockets);

        const totalSavings = storedSavings.reduce(
          (sum, s) => sum + (typeof s.currentAmount === 'number' ? s.currentAmount : 0),
          0
        );

        setSavingsTotal(totalSavings);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load data');
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
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <Text
          style={{
            textAlign: 'center',
            marginTop: 40,
            color: colors.muted,
          }}
        >
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  /* ====================
     CALCULATIONS (CORRECT)
  ==================== */

  // SAFE
  const safeBalanceDisplay = formatCurrencyDisplay(
    user.balance,
    user.currency
  );

  // POCKET TOTAL
  const totalPocketBalance = pockets.reduce(
    (sum, p) => sum + (typeof p.amount === 'number' ? p.amount : 0),
    0
  );

  // ✅ TOTAL BALANCE (DERIVED — SOURCE OF TRUTH)
  const totalBalance = getCurrentTotalBalance();

  const totalBalanceDisplay = formatCurrencyDisplay(
    totalBalance,
    user.currency
  );

  // MOST COSTLY POCKET
  const mostCostlyPocket =
    pockets.length > 0
      ? [...pockets].sort((a, b) => b.amount - a.amount)[0]
      : null;

  // MOST EXPENSIVE SAVINGS
  const savings = getSavings();

  const mostExpensiveSavings =
    savings.length > 0
      ? [...savings].sort((a, b) => b.targetAmount - a.targetAmount)[0]
      : null;

  /* ====================
     PIE DATA
  ==================== */
  const validPockets = pockets.filter(
    p => typeof p.amount === 'number' && p.amount > 0
  );

  const totalPocketAmount = validPockets.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const pieData = validPockets.map((p, index) => {
    const percent =
      totalPocketAmount > 0
        ? Math.round((p.amount / totalPocketAmount) * 100)
        : 0;

    return {
      name: p.name,
      percent,
      population: p.amount,
      color: PIE_COLORS[index % PIE_COLORS.length],
    };
  });

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
      const { saveUser } = require('./utils/mmkvStorage');
      const updatedUser = {
        ...user,
        balance: Number(editedBalance),
      };
      
      saveUser(updatedUser);
      
      setUser(updatedUser);
      setShowConfirmBalanceModal(false);
      setShowSuccessBalanceModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to update balance');
    }
  };

  /* ====================
     UI
  ==================== */
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BALANCE CARD */}
        <View style={styles.gradientBalanceCard}>
          <LinearGradient
            colors={['#528d94', '#314e5e', '#203646', '#0f1e2e']}
            style={styles.gradientBalanceCardInner}
          >
            {/* PROFILE */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <View style={styles.profileImageContainer}>
                <Icon
                  name="person"
                  size={32}
                  color="rgba(255,255,255,0.9)"
                />
              </View>

              <View style={styles.profileTextContainer}>
                <Text style={styles.cardGreeting}>
                  HELLO, {user.name.toUpperCase()}!
                </Text>
                <Text style={styles.cardEmail}>
                  {user.email.toLowerCase()}
                </Text>
              </View>
            </View>

            {/* SAFE BALANCE */}
            <View style={styles.safeBalanceSection}>
              <Text style={styles.safeBalanceLabel}>
                SAFE BALANCE:
              </Text>
              <Text style={styles.safeBalanceAmount}>
                {safeBalanceDisplay.full}
              </Text>
            </View>

            {/* TOTAL BALANCE */}
            <View style={styles.totalBalanceSection}>
              <Text style={styles.totalBalanceLabel}>
                TOTAL BALANCE:
              </Text>

              <View style={styles.totalBalanceContainer}>
                {showTotalBalance ? (
                  <>
                    <Text style={styles.totalBalanceAmount}>
                      {totalBalanceDisplay.full}
                    </Text>
                    <TouchableOpacity
                      style={styles.eyeIconButton}
                      onPress={() => setShowTotalBalance(false)}
                    >
                      <Icon
                        name="eye-off-outline"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.dotsText}>
                      ••••••••
                    </Text>
                    <TouchableOpacity
                      style={styles.eyeIconButton}
                      onPress={() => setShowTotalBalance(true)}
                    >
                      <Icon
                        name="eye-outline"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.addFundsButton}
                onPress={() =>
                  router.push('/components/addFunds')
                }
              >
                <Text style={styles.addFundsButtonText}>
                  Add Funds
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.transferFundsButton}
                onPress={() =>
                  router.push('/components/transfer')
                }
              >
                <Text style={styles.transferFundsButtonText}>
                  Transfer Funds
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* POCKETS */}
        <View
          style={{
            marginHorizontal: 12,
            marginBottom: 12,
          }}
        >
          <View
            style={[
              styles.pocketsList,
              {
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: colors.card,
              },
            ]}
          >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: colors.text,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 12,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            MY POCKETS
          </Text>
          {pockets.length === 0 ? (
            <Text style={{ paddingHorizontal: 20, paddingBottom: 20, color: colors.muted }}>
              No pockets yet
            </Text>
          ) : (
            pockets.map((p, i) => {
              const amount = formatCurrencyDisplay(
                p.amount,
                user.currency
              );
              return (
                <View
                  key={p.id}
                  style={[
                    styles.pocketRow,
                    i === pockets.length - 1 && {
                      borderBottomWidth: 0,
                    },
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text
                    style={[
                      styles.pocketName,
                      { color: colors.text },
                    ]}
                  >
                    {p.name}
                  </Text>
                  <Text
                    style={[
                      styles.pocketAmount,
                      { color: colors.text },
                    ]}
                  >
                    {amount.full}
                  </Text>
                </View>
              );
            })
          )}
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            marginHorizontal: 12,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 12,
            }}
          >
            STATS
          </Text>

          <StatRow
            label="Pocket Balance"
            value={
              formatCurrencyDisplay(
                totalPocketBalance,
                user.currency
              ).full
            }
          />

          <StatRow
            label="Savings Balance"
            value={
              formatCurrencyDisplay(
                savingsTotal,
                user.currency
              ).full
            }
          />

          {mostCostlyPocket && (
            <StatRow
              label="Most Costly Pocket"
              value={`${mostCostlyPocket.name} • ${
                formatCurrencyDisplay(
                  mostCostlyPocket.amount,
                  user.currency
                ).full
              }`}
            />
          )}

          {mostExpensiveSavings && (
            <StatRow
              label="Most Expensive Savings Goal"
              value={`${mostExpensiveSavings.name} • ${
                formatCurrencyDisplay(
                  mostExpensiveSavings.targetAmount,
                  user.currency
                ).full
              }`}
            />
          )}
        </View>

        {/* POCKET DISTRIBUTION */}
        {pieData.length > 0 && (
          <View
            style={{
              marginHorizontal: 12,
              backgroundColor: colors.card,
              borderRadius: 24,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 12,
                paddingLeft: 18,
              }}
            >
              POCKET DISTRIBUTION
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 18,
              }}
            >
              <PieChart
                data={pieData}
                width={220}
                height={220}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                center={[60, 0]}
                chartConfig={{
                  color: () => colors.text,
                }}
              />

              <View style={{ marginLeft: 24 }}>
                {pieData.map(item => (
                  <View
                    key={item.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: item.color,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.text,
                      }}
                    >
                      {item.percent}% {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text
              style={{
                marginTop: 12,
                fontSize: 11,
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              Percentages are based on total pocket balance
            </Text>
          </View>
        )}

        <AllocationHealthChart
        safeBalance={user.balance}
        pocketTotal={totalPocketBalance}
        savingsTotal={savingsTotal}
        currency={user.currency}
      />

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
                borderLeftColor: '#0f4248',
                marginVertical: 16,
              }}>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
                  Note: This directly changes your safe balance without affecting pockets.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 24, gap: 10 }}>
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
                  backgroundColor: '#1C2B3A',
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

      <BottomNavbar />
    </SafeAreaView>
  );
}

/* ====================
   SMALL COMPONENTS
==================== */
const StatRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 13 }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
};
