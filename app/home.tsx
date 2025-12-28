import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import BurgerMenu from './components/BurgerMenu';
import { formatCurrencyDisplay } from './scripts/home';
import styles from './styles/HomeScreenStyles';
import { Packet, User } from './types';
import { getUser, setLoggedIn } from './utils/mmkvStorage';

export default function HomeScreen() {
  const router = useRouter();

  // STATE
  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTotalBalance, setShowTotalBalance] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // LOAD USER ON FOCUS
  useFocusEffect(
    useCallback(() => {
      const loadUserData = () => {
        setIsLoading(true);
        try {
          const loadedUser = getUser();
          if (!loadedUser) {
            router.replace('/login');
            return;
          }
          setUser(loadedUser);
          setPockets(loadedUser.pockets || []); // optional if you store pockets in user object
        } catch (err) {
          console.error('Failed to load user:', err);
          Alert.alert('Error', 'Failed to load user data.');
          router.replace('/login');
        } finally {
          setIsLoading(false);
        }
      };

      loadUserData();
    }, [])
  );

  // NAVIGATION HANDLERS
  const navigateToAddFunds = () => router.push('/components/addFunds');
  const navigateToBudget = () => router.push('/budget');
  const navigateToCards = () => router.push('/cards');
  const navigateToProfile = () => router.push('/profile');
  const navigateToHome = () => router.push('/home');

  const handleTransferFunds = () =>
    Alert.alert('Coming Soon', 'Transfer functionality coming soon!');

  const handleToggleBalance = () =>
    setShowTotalBalance((prev) => !prev);

  const handlePacketPress = (packetId: string) => {
    console.log(`Packet ${packetId} pressed`);
  };

  // LOGOUT
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          try {
            setLoggedIn(false);
            router.replace('/login');
          } catch (err) {
            console.error('Logout failed:', err);
            Alert.alert('Error', 'Failed to logout properly');
          }
        },
      },
    ]);
  };

  // LOADING STATE
  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // BALANCE DISPLAY
  const safeBalanceDisplay = formatCurrencyDisplay(user.balance, user.currency);
  const totalBalanceDisplay = formatCurrencyDisplay(
    user.balance + pockets.reduce((acc, p) => acc + p.amount, 0),
    user.currency
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* BALANCE CARD */}
        <View style={styles.gradientBalanceCard}>
          <LinearGradient
            colors={['#528d94', '#528d94']}
            style={styles.topExtension}
          />

          <LinearGradient
            colors={['#528d94', '#314e5e', '#203646', '#0f1e2e']}
            style={styles.gradientBalanceCardInner}
          >
            {/* HEADER */}
            <View style={{ ...styles.cardHeader, justifyContent: 'space-between' }}>
              {/* Burger Menu */}
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Icon name="menu" size={28} color="#fff" />
              </TouchableOpacity>

              {/* Profile */}
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 16 }}>
                <View style={styles.profileImageContainer}>
                  <Icon name="person" size={32} color="rgba(255,255,255,0.9)" />
                </View>

                <View style={styles.profileTextContainer}>
                  <Text style={styles.cardGreeting}>
                    HELLO, {user.name.toUpperCase()}!
                  </Text>
                  <Text style={styles.cardEmail}>{user.email.toLowerCase()}</Text>
                </View>
              </View>
            </View>

            {/* SAFE BALANCE */}
            <View style={styles.safeBalanceSection}>
              <Text style={styles.safeBalanceLabel}>SAFE BALANCE:</Text>
              <Text style={styles.safeBalanceAmount}>{safeBalanceDisplay.full}</Text>
            </View>

            {/* TOTAL BALANCE */}
            <View style={styles.totalBalanceSection}>
              <Text style={styles.totalBalanceLabel}>TOTAL BALANCE:</Text>
              <View style={styles.totalBalanceContainer}>
                {showTotalBalance ? (
                  <>
                    <Text style={styles.totalBalanceAmount}>{totalBalanceDisplay.full}</Text>
                    <TouchableOpacity style={styles.eyeIconButton} onPress={handleToggleBalance}>
                      <Icon name="eye-off-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.dotsText}>••••••••</Text>
                    <TouchableOpacity style={styles.eyeIconButton} onPress={handleToggleBalance}>
                      <Icon name="eye-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* ACTIONS */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.addFundsButton} onPress={navigateToAddFunds}>
                <Text style={styles.addFundsButtonText}>Add Funds</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.transferFundsButton} onPress={handleTransferFunds}>
                <Text style={styles.transferFundsButtonText}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* POCKETS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pockets:</Text>
          {pockets.length === 0 ? (
            <Text style={{ padding: 20, color: '#666' }}>No pockets yet</Text>
          ) : (
            pockets.map((packet) => {
              const amountDisplay = formatCurrencyDisplay(packet.amount, user.currency);
              return (
                <TouchableOpacity
                  key={packet.id}
                  style={styles.pocketRow}
                  onPress={() => handlePacketPress(packet.id)}
                >
                  <Text style={styles.pocketName}>{packet.name}</Text>
                  <Text style={styles.pocketAmount}>{amountDisplay.full}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
          <Icon name="home" size={22} color="#007AFF" />
          <Text style={styles.navItemTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={navigateToBudget}>
          <Icon name="pie-chart-outline" size={22} color="#8E8E93" />
          <Text style={styles.navItemText}>Budget</Text>
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
        onNotificationPress={() => console.log('Notifications')}
        onSettingsPress={() => console.log('Settings')}
        onHelpPress={() => console.log('Help')}
        onLogoutPress={handleLogout}
      />
    </SafeAreaView>
  );
}
