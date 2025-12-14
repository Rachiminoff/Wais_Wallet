import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Add this import
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import business logic
import {
  calculateAllocatedAmount,
  calculateSafeBalance,
  formatCurrencyDisplay,
  getPacketsForUser,
} from './scripts/home';

// Import auth hook and types
import { useAuth } from './context/AuthContext';
import styles from './styles/HomeScreenStyles';
import { Packet } from './types';

const Home: React.FC = () => {
  const router = useRouter(); // Use expo-router's router
  const { user: authUser, logout, error, loading: authLoading } = useAuth(); // Get user from auth context
  
  // ====================
  // STATE MANAGEMENT
  // ====================
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTotalBalance, setShowTotalBalance] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Balance states
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [safeBalance, setSafeBalance] = useState<number>(0);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  // ====================
  // LIFE CYCLE
  // ====================
  useEffect(() => {
    // Wait for auth context to finish loading before checking authentication
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!authUser) {
      router.replace('/login');
      return;
    }
    loadUserData();
  }, [authUser, authLoading]);

  useEffect(() => {
    if (packets.length > 0 && authUser) {
      const allocated = calculateAllocatedAmount(packets);
      const safe = calculateSafeBalance(totalBalance, packets);
      
      setAllocatedAmount(allocated);
      setSafeBalance(safe);
    }
  }, [totalBalance, packets, authUser]);

  // Show context error if it appears
  useEffect(() => {
    if (error) {
      setLoadError(error);
    }
  }, [error]);

  // ====================
  // UI HANDLERS
  // ====================
  const loadUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setLoadError(null);
      // Get packets for the authenticated user
      if (authUser) {
        const userPackets = await getPacketsForUser(authUser.id);
        setPackets(userPackets);
        
        // Use balance from authenticated user
        setTotalBalance(authUser.balance);
        
        const allocated = calculateAllocatedAmount(userPackets);
        const safe = calculateSafeBalance(authUser.balance, userPackets);
        
        setAllocatedAmount(allocated);
        setSafeBalance(safe);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      console.error('Failed to load user data:', err);
      setLoadError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePacketPress = (packetId: number): void => {
    console.log(`Packet ${packetId} pressed`);
  };

  const handleToggleBalance = (): void => {
    setShowTotalBalance(!showTotalBalance);
  };

  // Navigate to Add Funds page - USING EXPO ROUTER
  const navigateToAddFunds = (): void => {
    try {
      router.push('./components/addFunds'); // Navigate to addFunds.tsx
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to Add Funds');
    }
  };

  // Handle transfer funds (TBA)
  const handleTransferFunds = (): void => {
    Alert.alert('Coming Soon', 'Transfer funds functionality coming soon!');
  };

  // Navigate to other pages
  const navigateToHome = (): void => {
    try {
      router.push('/home');
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };
  
  const navigateToBudget = (): void => {
    try {
      router.push('/budget'); // You'll need to create budget.tsx
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to Budget');
    }
  };
  
  const navigateToCards = (): void => {
    router.push('/cards'); // You'll need to create cards.tsx
  };
  
  const navigateToProfile = (): void => {
    router.push('/profile'); // You'll need to create profile.tsx
  };

  const handleLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          logout();
          router.replace('/login');
        },
        style: 'destructive',
      },
    ]);
  };

  // ====================
  // RENDER LOGIC
  // ====================
  if (isLoading || !authUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalBalanceDisplay = formatCurrencyDisplay(totalBalance, authUser.currency);
  const safeBalanceDisplay = formatCurrencyDisplay(safeBalance, authUser.currency);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* GRADIENT BALANCE CARD */}
        <View style={styles.gradientBalanceCard}>
          {/* Sharp top extension with gradient */}
          <LinearGradient
            colors={['#528d94', '#528d94']}
            style={styles.topExtension}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          
          <LinearGradient
            colors={['#528d94', '#3a6d73']}
            style={styles.gradientBalanceCardInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Greeting and Email with Profile Picture */}
            <View style={styles.cardHeader}>
              <View style={styles.profileImageContainer}>
                <Icon name="person" size={32} color="rgba(255, 255, 255, 0.9)" />
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.cardGreeting}>HELLO, {authUser.name.toUpperCase()}!</Text>
                <Text style={styles.cardEmail}>{authUser.email.toLowerCase()}</Text>
              </View>
            </View>
            
            {/* SAFE BALANCE - LEFT ALIGNED, BIG FONT */}
            <View style={styles.safeBalanceSection}>
              <Text style={styles.safeBalanceLabel}>SAFE BALANCE:</Text>
              <Text style={styles.safeBalanceAmount}>{safeBalanceDisplay.full}</Text>
            </View>
            
            {/* TOTAL BALANCE - LEFT ALIGNED, SMALLER FONT, CENSORED */}
            <View style={styles.totalBalanceSection}>
              <Text style={styles.totalBalanceLabel}>TOTAL BALANCE:</Text>
              <View 
                style={styles.totalBalanceContainer}
              >
                {showTotalBalance ? (
                  <>
                    <Text style={styles.totalBalanceAmount}>{totalBalanceDisplay.full}</Text>
                    <TouchableOpacity 
                      style={styles.eyeIconButton}
                      onPress={handleToggleBalance}
                    >
                      <Icon name="eye-off-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.dotsContainer}>
                      <Text style={styles.dotsText}>••••••••</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.eyeIconButton}
                      onPress={handleToggleBalance}
                    >
                      <Icon name="eye-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            
            {/* ACTION BUTTONS - NO ICONS, COLOR #d4e3e1 */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.addFundsButton}
                onPress={navigateToAddFunds}
                activeOpacity={0.7}
              >
                <Text style={styles.addFundsButtonText}>Add</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.transferFundsButton}
                onPress={handleTransferFunds}
                activeOpacity={0.7}
              >
                <Text style={styles.transferFundsButtonText}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* POCKETS SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pockets:</Text>
          </View>
          <View style={styles.pocketsList}>
            {packets.map((packet: Packet, index: number) => {
              const packetAmountDisplay = formatCurrencyDisplay(packet.amount, 'PHP');
              return (
                <TouchableOpacity
                  key={packet.id}
                  style={[
                    styles.pocketRow,
                    index === packets.length - 1 && styles.pocketRowLast,
                  ]}
                  onPress={() => handlePacketPress(packet.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.pocketName}>{packet.name}</Text>
                  <Text style={styles.pocketAmount}>{packetAmountDisplay.full}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAVBAR WITH ICONS */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToHome}
        >
          <View style={styles.navIconContainer}>
            <Icon name="home" size={22} color="#007AFF" />
          </View>
          <Text style={styles.navItemTextActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToBudget}
        >
          <View style={styles.navIconContainer}>
            <Icon name="pie-chart-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToCards}
        >
          <View style={styles.navIconContainer}>
            <Icon name="card-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToProfile}
        >
          <View style={styles.navIconContainer}>
            <Icon name="person-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;