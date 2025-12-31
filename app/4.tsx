import { useFocusEffect, useRouter } from 'expo-router';
import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles/budgetStyles';
import { Packet, User } from './types';

import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useTheme } from './context/ThemeContext';
import {
    getPockets,
    getUser,
} from './utils/mmkvStorage';

/* =========================
   BUDGET SCREEN
========================= */

const BudgetScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();

  /* =========================
     STATE
  ========================= */

  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /* =========================
     LOAD DATA
  ========================= */

  useFocusEffect(
    useCallback(() => {
      const loadData = () => {
        setIsLoading(true);

        try {
          const loadedUser = getUser();

          if (!loadedUser) {
            router.replace('/login');
            return;
          }

          setUser(loadedUser);
          setPockets(getPockets());
        } catch (error) {
          console.error(
            'Budget load error:',
            error
          );
          Alert.alert(
            'Error',
            'Failed to load budget data.'
          );
          router.replace('/login');
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }, [])
  );

  /* =========================
     NAVIGATION
  ========================= */

  const goAddFunds = () =>
    router.push('/components/addFunds');

  const goAddPocket = () =>
    router.push('/components/addPocket');

  const goEditPockets = () =>
    router.push('/components/EditPocketScreen');

  /* =========================
     DERIVED VALUES
  ========================= */

  const formattedBalance = useMemo(() => {
    if (!user) return '₱0.00';

    return `₱${user.balance.toLocaleString(
      'en-PH',
      {
        minimumFractionDigits: 2,
      }
    )}`;
  }, [user]);

  const hasPockets = pockets.length > 0;

  /* =========================
     LOADING STATE
  ========================= */

  if (isLoading || !user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <ThemeWrapper>
          <View style={styles.loadingContainer}>
            <Text
              style={[
                styles.loadingText,
                { color: colors.text },
              ]}
            >
              Loading…
            </Text>
          </View>
        </ThemeWrapper>
      </SafeAreaView>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ThemeWrapper scroll>
        {/* =========================
            HEADER
        ========================= */}

        <View
          style={[
            styles.header,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text },
            ]}
          >
            Budget Planner
          </Text>
        </View>

        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={goAddFunds}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: '#fff' },
              ]}
            >
              Add Fund
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={goAddPocket}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: '#fff' },
              ]}
            >
              Add Pocket
            </Text>
          </TouchableOpacity>
        </View>

        {/* =========================
            CONTENT
        ========================= */}

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* =========================
              SAFE BALANCE
          ========================= */}

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.cardLabel,
                { color: colors.text },
              ]}
            >
              Safe Balance{' '}
              <Text
                style={[
                  styles.mutedText,
                  {
                    color:
                      colors.subtleText,
                  },
                ]}
              >
                (Not Allocated)
              </Text>
            </Text>

            <Text
              style={[
                styles.balanceText,
                { color: colors.text },
              ]}
            >
              {formattedBalance}
            </Text>
          </View>

          {/* =========================
              POCKETS
          ========================= */}

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <View
              style={
                styles.pocketHeader
              }
            >
              <Text
                style={[
                  styles.cardLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Pockets
              </Text>

              <TouchableOpacity
                onPress={
                  goEditPockets
                }
                disabled={!hasPockets}
              >
                <Icon
                  name="pencil-sharp"
                  size={18}
                  color={
                    hasPockets
                      ? colors.subtleText
                      : colors.border
                  }
                />
              </TouchableOpacity>
            </View>

            {!hasPockets && (
              <Text
                style={[
                  styles.mutedText,
                  {
                    color:
                      colors.subtleText,
                  },
                ]}
              >
                No pockets yet
              </Text>
            )}

            {pockets.map((pocket) => {
              const amount = Number(
                pocket.amount ?? 0
              );

              let amountColor =
                colors.text;

              if (amount === 0) {
                amountColor =
                  colors.danger;
              }

              if (
                amount > 0 &&
                pocket.name
                  ?.toLowerCase() ===
                  'savings'
              ) {
                amountColor =
                  colors.success;
              }

              return (
                <View
                  key={pocket.id}
                  style={
                    styles.pocketRow
                  }
                >
                  <Text
                    style={[
                      styles.pocketName,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {pocket.name}
                  </Text>

                  <Text
                    style={[
                      styles.pocketAmount,
                      {
                        color:
                          amountColor,
                      },
                    ]}
                  >
                    ₱
                    {amount.toLocaleString(
                      'en-PH',
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* =========================
            BOTTOM NAV (COMPONENT)
        ========================= */}

        <BottomNavbar active="budget" />
      </ThemeWrapper>
    </SafeAreaView>
  );
};

export default BudgetScreen;
