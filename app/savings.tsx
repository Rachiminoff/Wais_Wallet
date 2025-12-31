import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomNavbar } from './components/BottomNavbar'; // ✅ REUSABLE NAVBAR
import { useTheme } from './context/ThemeContext';
import styles from './styles/savingsStyles';
import { SavingsGoal } from './types';
import { getSavings } from './utils/mmkvStorage';

/* =========================
   SAVINGS SCREEN
========================= */

export default function SavingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  /* =========================
     STATE
  ========================= */

  const [savings, setSavings] = useState<SavingsGoal[]>([]);

  /* =========================
     LOAD DATA
  ========================= */

  useFocusEffect(
    useCallback(() => {
      setSavings(getSavings());
    }, [])
  );

  /* =========================
     UI
  ========================= */

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      {/* =========================
          HEADER
      ========================= */}

      <View
        style={[
          styles.header,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          Savings
        </Text>

        <TouchableOpacity
          style={styles.addGoalButton}
          onPress={() =>
            router.push(
              '/components/NewSavingsGoalScreen'
            )
          }
        >
          <Text style={styles.addGoalText}>
            + New Goal
          </Text>
        </TouchableOpacity>
      </View>

      {/* =========================
          SAVINGS LIST
      ========================= */}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {savings.length === 0 && (
          <Text
            style={[
              styles.emptyText,
              { color: colors.muted },
            ]}
          >
            No savings goals yet
          </Text>
        )}

        {savings.map(goal => {
          const progress =
            goal.currentAmount / goal.targetAmount;

          const percent = Math.min(
            Math.round(progress * 100),
            100
          );

          return (
            <View
              key={goal.id}
              style={[
                styles.card,
                { backgroundColor: colors.card },
              ]}
            >
              {/* CARD HEADER */}
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.goalName,
                    { color: colors.text },
                  ]}
                >
                  {goal.name}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        '/components/EditSavingsGoalScreen',
                      params: { id: goal.id },
                    })
                  }
                >
                  <Icon
                    name="pencil-sharp"
                    size={18}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* AMOUNTS */}
              <View style={styles.amountRow}>
                <Text
                  style={[
                    styles.currentAmount,
                    { color: colors.text },
                  ]}
                >
                  ₱{goal.currentAmount.toLocaleString()}
                </Text>

                <Text
                  style={[
                    styles.targetAmount,
                    { color: colors.muted },
                  ]}
                >
                  / ₱{goal.targetAmount.toLocaleString()}
                </Text>
              </View>

              {/* PROGRESS BAR */}
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percent}%` },
                  ]}
                >
                  <Text style={styles.progressText}>
                    {percent}%
                  </Text>
                </View>
              </View>

              {/* ACTION */}
              <TouchableOpacity
                style={styles.addSavingsButton}
                onPress={() =>
                  router.push({
                    pathname:
                      '/components/AddToSavingsScreen',
                    params: { id: goal.id },
                  })
                }
              >
                <Text style={styles.addSavingsText}>
                  + Add Savings
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <BottomNavbar />
    </SafeAreaView>
  );
}

