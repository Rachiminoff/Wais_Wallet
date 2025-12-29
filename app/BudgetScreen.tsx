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

import BurgerMenu from './components/BurgerMenu';
import styles from './styles/budgetStyles';

import { Packet, User } from './types';
import { getPockets, getUser } from './utils/mmkvStorage';

export default function BudgetScreen() {
  const router = useRouter();

  // --------------------
  // STATE
  // --------------------
  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --------------------
  // LOAD USER + POCKETS
  // --------------------
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
        } catch (err) {
          console.error('Failed to load budget data:', err);
          Alert.alert('Error', 'Failed to load budget data.');
          router.replace('/login');
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }, [])
  );

  // --------------------
  // NAVIGATION
  // --------------------
  const navigateToAddFunds = () => router.push('/components/addFunds');
  const navigateToAddPocket = () => router.push('/components/addPocket');
  const navigateToEditPockets = () => router.push('/components/EditPocketScreen');
  const navigateToHome = () => router.push('/home');
  const navigateToCards = () => router.push('/cards');
  const navigateToProfile = () => router.push('/profile');

  // --------------------
  // LOADING STATE
  // --------------------
  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // --------------------
  // UI
  // --------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Planner</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Icon name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={navigateToAddFunds}
        >
          <Text style={styles.primaryButtonText}>Add Fund</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={navigateToAddPocket}
        >
          <Text style={styles.primaryButtonText}>Add Pocket</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* SAFE BALANCE */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            Safe Balance{' '}
            <Text style={styles.mutedText}>(Not Allocated)</Text>
          </Text>
          <Text style={styles.balanceText}>
            ₱{user.balance.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        {/* POCKETS */}
        <View style={styles.card}>
          <View style={styles.pocketHeader}>
            <Text style={styles.cardLabel}>Pockets</Text>

            {/* ✏️ EDIT ICON */}
            <TouchableOpacity
              onPress={navigateToEditPockets}
              disabled={pockets.length === 0}
            >
              <Icon
                name="pencil-sharp"
                size={18}
                color={pockets.length === 0 ? '#ccc' : '#8E8E93'}
              />
            </TouchableOpacity>
          </View>

          {pockets.length === 0 && (
            <Text style={styles.mutedText}>No pockets yet</Text>
          )}

          {pockets.map((pocket) => {
            const amount = Number(pocket.amount ?? 0);

            let amountStyle = styles.neutral;
            if (amount === 0) amountStyle = styles.negative;
            if (
              amount > 0 &&
              pocket.name?.toLowerCase() === 'savings'
            ) {
              amountStyle = styles.positive;
            }

            return (
              <View key={pocket.id} style={styles.pocketRow}>
                <Text style={styles.pocketName}>{pocket.name}</Text>
                <Text style={[styles.pocketAmount, amountStyle]}>
                  ₱{amount.toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
          <Icon name="home" size={22} color="#8E8E93" />
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="pie-chart" size={22} color="#007AFF" />
          <Text style={styles.navItemTextActive}>Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={navigateToCards}>
          <Icon name="card-outline" size={22} color="#8E8E93" />
          <Text style={styles.navItemText}>Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
          <Icon name="person-outline" size={22} color="#8E8E93" />
          <Text style={styles.navItemText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* BURGER MENU */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNotificationPress={() => {}}
        onSettingsPress={() => {}}
        onHelpPress={() => {}}
      />
    </View>
  );
}

