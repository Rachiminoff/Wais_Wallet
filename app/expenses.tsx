import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useTheme } from './context/ThemeContext';
import styles from './styles/expensesStyles';
import { User } from './types';
import { getExpenses, getUser, type Expense } from './utils/mmkvStorage';

export default function ExpensesScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'week' | 'month' | '3months'>('week');

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
        setExpenses(getExpenses());
      } catch (err) {
        Alert.alert('Error', 'Failed to load expenses data');
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    }, [])
  );

  /* ====================
     FILTER EXPENSES
  ==================== */
  const getFilteredExpenses = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      if (selectedFilter === 'week') {
        // Get start of current week (Sunday)
        const dayOfWeek = startOfToday.getDay();
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - dayOfWeek);
        return expenseDate >= startOfWeek;
      } else if (selectedFilter === 'month') {
        // Get start of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenseDate >= startOfMonth;
      } else if (selectedFilter === '3months') {
        // Get date 3 months ago
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return expenseDate >= threeMonthsAgo;
      }
      return true;
    });
  };

  /* ====================
     GROUP EXPENSES BY DATE
  ==================== */
  const groupExpensesByDate = () => {
    const filtered = getFilteredExpenses();
    const grouped: { [key: string]: Expense[] } = {};
    
    filtered.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });
    
    return grouped;
  };

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
      <View style={[styles.header, { paddingTop: 30, backgroundColor: colors.background }]}>
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
          Expenses:
        </Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 },
        ]}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >

        {/* ADD EXPENSE BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/components/addExpense')}
        >
          <Text style={[styles.addButtonText, { fontFamily: font.family }]}>Add Expense</Text>
        </TouchableOpacity>

        {/* FILTER TABS */}
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              { backgroundColor: selectedFilter === 'week' ? '#1C2B3A' : colors.border }
            ]}
            onPress={() => setSelectedFilter('week')}
          >
            <Text style={[
              styles.filterText, 
              { 
                color: selectedFilter === 'week' ? '#FFF' : colors.muted, 
                fontFamily: font.family 
              }
            ]}>
              This week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              { backgroundColor: selectedFilter === 'month' ? '#1C2B3A' : colors.border }
            ]}
            onPress={() => setSelectedFilter('month')}
          >
            <Text style={[
              styles.filterText, 
              { 
                color: selectedFilter === 'month' ? '#FFF' : colors.muted, 
                fontFamily: font.family 
              }
            ]}>
              This month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterTab, 
              { backgroundColor: selectedFilter === '3months' ? '#1C2B3A' : colors.border }
            ]}
            onPress={() => setSelectedFilter('3months')}
          >
            <Text style={[
              styles.filterText, 
              { 
                color: selectedFilter === '3months' ? '#FFF' : colors.muted, 
                fontFamily: font.family 
              }
            ]}>
              Last 3 months
            </Text>
          </TouchableOpacity>
        </View>

        {/* EXPENSE ENTRIES */}
        {expenses.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: colors.muted, fontSize: 15 }}>No expenses yet</Text>
          </View>
        ) : (
          Object.entries(groupExpensesByDate()).map(([date, dateExpenses]) => (
            <View key={date} style={[styles.expenseGroup, { backgroundColor: colors.card }]}>
              <View style={[styles.dateHeader, { borderBottomColor: colors.border }]}>
                <Text
                  style={[
                    styles.dateText,
                    { color: colors.text, fontFamily: font.family },
                  ]}
                >
                  {date}
                </Text>
              </View>

              {dateExpenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={[styles.expenseLabel, { color: colors.text, fontFamily: font.family }]}>
                      {expense.pocketName}
                    </Text>
                    {expense.note && (
                      <Text 
                        style={[styles.expenseNote, { color: colors.muted, fontFamily: font.family }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {expense.note}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.expenseAmount, { fontFamily: font.family }]}>-₱{expense.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNavbar />
    </ThemeWrapper>
  );
}
