// HomeScreen.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { getStats } from './utils/mmkvStorage';

import { BottomNavbar } from './components/BottomNavbar';
import { useTheme } from './context/ThemeContext';
import { formatCurrencyDisplay } from './scripts/home';
import styles from './styles/HomeScreenStyles';
import { Packet, User } from './types';
import { getPockets, getSavings, getUser } from './utils/mmkvStorage';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showTotalBalance, setShowTotalBalance] = useState(false);

  /* ====================
     LOAD DATA
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

        setUser(storedUser);
        setPockets(getPockets());
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
     CALCULATIONS
  ==================== */
  const safeBalanceDisplay = formatCurrencyDisplay(user.balance, user.currency);

  const totalPocketBalance = pockets.reduce(
    (sum, p) => sum + (typeof p.amount === 'number' ? p.amount : 0),
    0
  );

const stats = getStats();

const totalBalance = stats.totalBalanceAllTime;
const totalBalanceDisplay = formatCurrencyDisplay(
  totalBalance,
  user.currency
);


  const savings = getSavings();

  const mostCostlyPocket =
    pockets.length > 0
      ? [...pockets].sort((a, b) => b.amount - a.amount)[0]
      : null;

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

  const totalPocketAmount = validPockets.reduce((sum, p) => sum + p.amount, 0);

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
     UI
  ==================== */
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BALANCE CARD */}
        <View style={styles.gradientBalanceCard}>
          <LinearGradient
            colors={['#528d94', '#314e5e', '#203646', '#0f1e2e']}
            style={styles.gradientBalanceCardInner}
          >
            {/* PROFILE */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
              <View style={styles.profileImageContainer}>
                <Icon name="person" size={32} color="rgba(255,255,255,0.9)" />
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
              <Text style={styles.safeBalanceLabel}>SAFE BALANCE:</Text>
              <Text style={styles.safeBalanceAmount}>
                {safeBalanceDisplay.full}
              </Text>
            </View>

            {/* TOTAL BALANCE */}
            <View style={styles.totalBalanceSection}>
              <Text style={styles.totalBalanceLabel}>TOTAL BALANCE:</Text>

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
                      <Icon name="eye-off-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.dotsText}>••••••••</Text>
                    <TouchableOpacity
                      style={styles.eyeIconButton}
                      onPress={() => setShowTotalBalance(true)}
                    >
                      <Icon name="eye-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.addFundsButton}
                onPress={() => router.push('/components/addFunds')}
              >
                <Text style={styles.addFundsButtonText}>Add Funds</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.transferFundsButton}
                onPress={() => router.push('/components/transfer')}
              >
                <Text style={styles.transferFundsButtonText}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* POCKETS */}
        <View
          style={[
            styles.pocketsList,
            {
              marginHorizontal: 12,
              borderRadius: 24,
              overflow: 'hidden',
              marginBottom: 12,
              backgroundColor: colors.card,
            },
          ]}
        >
          {pockets.length === 0 ? (
            <Text style={{ padding: 20, color: colors.muted }}>
              No pockets yet
            </Text>
          ) : (
            pockets.map((p, i) => {
              const amount = formatCurrencyDisplay(p.amount, user.currency);
              return (
                <View
                  key={p.id}
                  style={[
                    styles.pocketRow,
                    i === pockets.length - 1 && { borderBottomWidth: 0 },
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text style={[styles.pocketName, { color: colors.text }]}>
                    {p.name}
                  </Text>
                  <Text style={[styles.pocketAmount, { color: colors.text }]}>
                    {amount.full}
                  </Text>
                </View>
              );
            })
          )}
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
            value={formatCurrencyDisplay(totalPocketBalance, user.currency).full}
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

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
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
                    <Text style={{ fontSize: 13, color: colors.text }}>
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

        {/* SPACE FOR NAVBAR */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNavbar />
    </SafeAreaView>
  );
}

/* ====================
   SMALL COMPONENTS
==================== */
const StatRow = ({ label, value }: { label: string; value: string }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 13 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
        {value}
      </Text>
    </View>
  );
};
