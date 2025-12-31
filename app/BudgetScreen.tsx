// BudgetScreen.tsx

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useTheme } from './context/ThemeContext';
import styles from './styles/budgetStyles';
import { Packet, User } from './types';
import { getPockets, getUser } from './utils/mmkvStorage';

export default function BudgetScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
     UI
  ==================== */
  return (
    <ThemeWrapper>
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            {
              color: colors.text,
              fontFamily: font.family,
              fontSize: font.size + 4,
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
              Add Fund
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
        </View>

        {/* SAFE BALANCE */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.cardLabel,
              { color: colors.text, fontFamily: font.family },
            ]}
          >
            Safe Balance{' '}
            <Text style={{ color: colors.muted }}>(Not Allocated)</Text>
          </Text>

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
              Pockets
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
              <View key={pocket.id} style={styles.pocketRow}>
                <Text style={[styles.pocketName, { color: colors.text }]}>
                  {pocket.name}
                </Text>
                <Text
                  style={[styles.pocketAmount, { color: amountColor }]}
                >
                  ₱
                  {amount.toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* BOTTOM NAV (REUSABLE COMPONENT) */}
      <BottomNavbar />
    </ThemeWrapper>
  );
}


