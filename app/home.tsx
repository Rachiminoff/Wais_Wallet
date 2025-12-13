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
  getCurrentUser,
  getPacketsForUser,
} from './scripts/home';

// Import types and styles
import styles from './styles/HomeScreenStyles';
import { Packet, User } from './types';

const Home: React.FC = () => {
  const router = useRouter(); // Use expo-router's router
  
  // ====================
  // STATE MANAGEMENT
  // ====================
  const [user, setUser] = useState<User | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTotalBalance, setShowTotalBalance] = useState<boolean>(false);
  
  // Balance states
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [safeBalance, setSafeBalance] = useState<number>(0);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  // ====================
  // LIFE CYCLE
  // ====================
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (packets.length > 0 && user) {
      const allocated = calculateAllocatedAmount(packets);
      const safe = calculateSafeBalance(totalBalance, packets);
      
      setAllocatedAmount(allocated);
      setSafeBalance(safe);
    }
  }, [totalBalance, packets, user]);

  // ====================
  // UI HANDLERS
  // ====================
  const loadUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      const userPackets = await getPacketsForUser(currentUser.id);
      
      setUser(currentUser);
      setPackets(userPackets);
      
      setTotalBalance(currentUser.balance);
      
      const allocated = calculateAllocatedAmount(userPackets);
      const safe = calculateSafeBalance(currentUser.balance, userPackets);
      
      setAllocatedAmount(allocated);
      setSafeBalance(safe);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert('Error', 'Failed to load your data');
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
    router.push('./components/addFunds'); // Navigate to addFunds.tsx
  };

  // Handle transfer funds (TBA)
  const handleTransferFunds = (): void => {
    Alert.alert('Coming Soon', 'Transfer funds functionality coming soon!');
  };

  // Navigate to other pages
  const navigateToHome = (): void => {
    router.push('/home');
  };
  
  const navigateToBudget = (): void => {
    router.push('/budget'); // You'll need to create budget.tsx
  };
  
  const navigateToCards = (): void => {
    router.push('/cards'); // You'll need to create cards.tsx
  };
  
  const navigateToProfile = (): void => {
    router.push('/profile'); // You'll need to create profile.tsx
  };

  // ====================
  // RENDER LOGIC
  // ====================
  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalBalanceDisplay = formatCurrencyDisplay(totalBalance, 'PHP');
  const safeBalanceDisplay = formatCurrencyDisplay(safeBalance, 'PHP');

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
                <Text style={styles.cardGreeting}>HELLO, {user.name.toUpperCase()}!</Text>
                <Text style={styles.cardEmail}>{user.email.toLowerCase()}</Text>
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
              <TouchableOpacity 
                style={styles.totalBalanceContainer}
                onPress={handleToggleBalance}
                activeOpacity={0.7}
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
              </TouchableOpacity>
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