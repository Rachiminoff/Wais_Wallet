import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTransactions, Transaction } from '../utils/mmkvStorage';

export default function TransactionsScreen() {
  const { colors, font } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isPositive =
      item.type === 'ADD_FUNDS' || item.type === 'POCKET_TO_SAFE';

    return (
      <View
        style={[
          styles.row,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.icon}>
          <Ionicons
            name={iconMap[item.type]}
            size={22}
            color={isPositive ? '#2ecc71' : '#e74c3c'}
          />
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.desc,
              { color: colors.text, fontSize: font },
            ]}
          >
            {item.description}
          </Text>

          <Text style={[styles.date, { color: '#888' }]}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            { color: isPositive ? '#2ecc71' : '#e74c3c', fontSize: font },
          ]}
        >
          {isPositive ? '+' : '-'}₱{item.amount.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: font + 4 }]}>
        Transaction History
      </Text>

      {transactions.length === 0 ? (
        <Text style={[styles.empty, { color: '#888' }]}>
          No transactions yet
        </Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false} // hide vertical scrollbar
          showsHorizontalScrollIndicator={false} // hide horizontal scrollbar
        />
      )}
    </View>
  );
}

/* ====================
   ICON MAP
==================== */
const iconMap: Record<Transaction['type'], any> = {
  ADD_FUNDS: 'add-circle-outline',
  POCKET_CREATE: 'wallet-outline',
  POCKET_ADD_FUNDS: 'add-outline',
  POCKET_DELETE: 'trash-outline',
  POCKET_TO_SAFE: 'swap-horizontal-outline',
  SAVINGS_CREATE: 'flag-outline',
  SAVINGS_ADD: 'trending-up-outline',
  SAVINGS_DELETE: 'close-circle-outline',
};

/* ====================
   STYLES
==================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10, // ensure content not touching edges
  },

  title: {
    fontWeight: '700',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  icon: {
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  desc: {
    fontWeight: '500',
  },

  date: {
    fontSize: 11,
    marginTop: 2,
  },

  amount: {
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: 80,
  },
});
