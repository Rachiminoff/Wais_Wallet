import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { archiveTransaction, getTransactions, Transaction, unarchiveTransaction } from '../utils/mmkvStorage';

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE' | 'POCKETS' | 'SAVINGS';

export default function TransactionsScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedMessage, setArchivedMessage] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const showArchivedToast = (message: string) => {
    setArchivedMessage(message);
    fadeAnim.setValue(1);
    
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setArchivedMessage(null);
      });
    }, 3500);
  };

  const handleArchiveToggle = (transactionId: string, isArchived: boolean) => {
    if (isArchived) {
      unarchiveTransaction(transactionId);
      showArchivedToast('Transaction restored');
    } else {
      archiveTransaction(transactionId);
      showArchivedToast('Transaction archived');
    }
    setTransactions(getTransactions());
  };

  const getFilteredTransactions = () => {
    let filtered = showArchived 
      ? transactions.filter(t => t.archived === true)
      : transactions.filter(t => !t.archived);
    
    if (filter === 'ALL') return filtered;
    
    if (filter === 'INCOME') {
      return filtered.filter(t => 
        t.type === 'ADD_FUNDS' ||
        t.type === 'POCKET_CREATE' ||
        t.type === 'POCKET_CREATE_FROM_SAFE' ||
        (t.type === 'POCKET_ADD_FUNDS' && t.description.includes('Added funds'))
      );
    }
    
    if (filter === 'EXPENSE') {
      return filtered.filter(t => 
        t.type === 'SUBTRACT_FUNDS'
      );
    }

    if (filter === 'POCKETS') {
      return filtered.filter(t =>
        t.type === 'POCKET_CREATE' ||
        t.type === 'POCKET_ADD_FUNDS' ||
        t.type === 'POCKET_DELETE' ||
        t.type === 'POCKET_CREATE_FROM_SAFE' ||
        t.type === 'POCKET_TO_SAFE' ||
        t.description.includes('Edited pocket') ||
        t.description.includes('Renamed pocket')
      );
    }

    if (filter === 'SAVINGS') {
      return filtered.filter(t =>
        t.type === 'SAVINGS_CREATE' ||
        t.type === 'SAVINGS_ADD' ||
        t.type === 'SAVINGS_DELETE'
      );
    }
    
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  const renderItem = ({ item }: { item: Transaction }) => {
    const isPositive =
      item.type === 'ADD_FUNDS' || item.type === 'POCKET_TO_SAFE' || item.type === 'POCKET_CREATE';
    const isEdit = item.description.includes('Edited pocket') || item.description.includes('Renamed pocket');
    const isDeletedSavings = item.type === 'SAVINGS_DELETE';
    const isDeletedPocket = item.type === 'POCKET_DELETE' || item.description.includes('Deleted pocket');
    const isTransfer = item.type === 'POCKET_CREATE_FROM_SAFE' || item.type === 'POCKET_ADD_FUNDS' || item.type === 'POCKET_TO_SAFE' || (item.type === 'POCKET_CREATE' && item.description?.includes('from Safe Balance'));
    const isSavings = item.type === 'SAVINGS_ADD' || item.type === 'SAVINGS_CREATE';
    const isExpense = !isPositive && !isTransfer && !isSavings && !isEdit && !isDeletedSavings && !isDeletedPocket;
    const isExpanded = expandedItems.has(item.id);
    const descLength = item.description.length;
    const shouldShowMore = descLength > 100;
    const displayDesc = isExpanded ? item.description : item.description.substring(0, 100);

    return (
      <View
        style={[
          styles.row,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.icon}>
          {isSavings ? (
            <MaterialCommunityIcons
              name="piggy-bank-outline"
              size={22}
              color="#f59e0b"
            />
          ) : isEdit ? (
            <Ionicons
              name="pencil"
              size={22}
              color="#9ca3af"
            />
          ) : isDeletedSavings || isDeletedPocket ? (
            <Ionicons
              name="warning-outline"
              size={22}
              color="#e74c3c"
            />
          ) : (
            <Ionicons
              name={isExpense ? 'cash-outline' : iconMap[item.type]}
              size={22}
              color={isExpense ? '#e74c3c' : (isTransfer ? '#3b82f6' : (isPositive ? '#2ecc71' : '#e74c3c'))}
            />
          )}
        </View>

        <View style={styles.info}>
          {item.description.includes('Expense from Safe Balance:') ? (
            <View>
              <Text style={[styles.desc, { color: colors.text, fontSize: font }]}>
                Expense from Safe Balance:
              </Text>
              <Text
                style={[
                  styles.noteContent,
                  { color: colors.text, fontSize: font - 1 },
                ]}
                numberOfLines={isExpanded ? undefined : 1}
              >
                {displayDesc.replace('Expense from Safe Balance: ', '')}
                {shouldShowMore && !isExpanded && '...'}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.desc,
                { color: colors.text, fontSize: font },
              ]}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {displayDesc}
              {shouldShowMore && !isExpanded && '...'}
            </Text>
          )}

          {shouldShowMore && (
            <TouchableOpacity onPress={() => toggleExpanded(item.id)}>
              <Text style={[styles.showMore, { color: colors.primary }]}>
                {isExpanded ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.date, { color: colors.text, opacity: 0.6 }]}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            { color: isSavings ? '#f59e0b' : (isTransfer ? '#3b82f6' : (isPositive ? '#2ecc71' : '#e74c3c')), fontSize: font },
          ]}
        >
          {isSavings ? '+' : (isTransfer ? '↔' : (isPositive ? '+' : '-'))}₱{item.amount.toLocaleString()}
        </Text>

        <TouchableOpacity
          onPress={() => handleArchiveToggle(item.id, item.archived || false)}
          style={styles.archiveButton}
        >
          <Ionicons
            name={item.archived ? 'return-up-back' : 'archive'}
            size={20}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER WITH BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: font + 4 }]}>
          Transaction History
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* FILTER BUTTONS */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            filter === 'ALL' && { backgroundColor: '#0f4248', borderColor: '#0f4248' },
          ]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'ALL' ? '#fff' : colors.text },
          ]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            filter === 'INCOME' && { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
          ]}
          onPress={() => setFilter('INCOME')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'INCOME' ? '#fff' : colors.text },
          ]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            filter === 'EXPENSE' && { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
          ]}
          onPress={() => setFilter('EXPENSE')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'EXPENSE' ? '#fff' : colors.text },
          ]}>
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            filter === 'POCKETS' && { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
          ]}
          onPress={() => setFilter('POCKETS')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'POCKETS' ? '#fff' : colors.text },
          ]}>
            Pockets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            filter === 'SAVINGS' && { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
          ]}
          onPress={() => setFilter('SAVINGS')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'SAVINGS' ? '#fff' : colors.text },
          ]}>
            Savings
          </Text>
        </TouchableOpacity>
      </View>

      {/* ARCHIVE TOGGLE */}
      <View style={styles.archiveToggleContainer}>
        <TouchableOpacity
          style={[
            styles.archiveToggle,
            { backgroundColor: showArchived ? '#64748b' : colors.card, borderColor: showArchived ? '#64748b' : colors.border },
          ]}
          onPress={() => setShowArchived(!showArchived)}
        >
          <Ionicons
            name={showArchived ? 'archive' : 'archive-outline'}
            size={18}
            color={showArchived ? '#fff' : colors.text}
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: showArchived ? '#fff' : colors.text,
          }}>
            {showArchived ? 'Archived' : 'Show Archived'}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredTransactions.length === 0 ? (
        <Text style={[styles.empty, { color: colors.text, opacity: 0.6 }]}>
          {showArchived ? 'No archived transactions' : 'No transactions yet'}
        </Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false} // hide vertical scrollbar
          showsHorizontalScrollIndicator={false} // hide horizontal scrollbar
        />
      )}

      {/* ARCHIVED TOAST NOTIFICATION */}
      {archivedMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            { 
              opacity: fadeAnim,
              backgroundColor: 'rgba(100, 116, 139, 0.75)',
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.toastText}>{archivedMessage}</Text>
        </Animated.View>
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
  POCKET_CREATE_FROM_SAFE: 'swap-horizontal-outline',
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
    paddingTop: 30,
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: -8,
  },

  title: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  divider: {
    height: 1.5,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 22,
    opacity: 0.15,
  },

  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },

  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderColor: '#94a3b8',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  icon: {
    marginRight: 12,
  },

  info: {
    flex: 1,
    marginRight: 8,
  },

  desc: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  noteContent: {
    fontWeight: '400',
    marginTop: 4,
    opacity: 0.9,
    fontSize: 12,
  },

  showMore: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  date: {
    fontSize: 11,
    marginTop: 2,
  },

  amount: {
    fontWeight: '700',
    fontSize: 15,
    minWidth: 70,
    textAlign: 'right',
  },

  archiveButton: {
    padding: 10,
    marginLeft: 4,
    borderRadius: 8,
  },

  archiveToggleContainer: {
    paddingHorizontal: 10,
    marginBottom: 18,
  },

  archiveToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderColor: '#94a3b8',
  },

  empty: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },

  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  toastText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
