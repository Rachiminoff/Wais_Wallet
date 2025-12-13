import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Import business logic
import {
  calculateAllocatedAmount,
  calculateSafeBalance,
  createTransaction,
  formatCurrencyDisplay,
  formatInputAmount,
  getCurrentUser,
  getPacketsForUser,
  updateTotalBalance,
  validateAmount
} from './scripts/home';

// Import types and styles
import styles from './styles/HomeScreenStyles';
import { Packet, User } from './types';

const Home: React.FC = () => {
  // ====================
  // STATE MANAGEMENT
  // ====================
  const [user, setUser] = useState<User | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTotalBalance, setShowTotalBalance] = useState<boolean>(false);
  
  // Balance states
  const [totalBalance, setTotalBalance] = useState<number>(0); // Will be loaded from user
  const [safeBalance, setSafeBalance] = useState<number>(0); // Will be calculated
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0); // Total in pockets
  
  // Modal states
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [amountInput, setAmountInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // ====================
  // LIFE CYCLE
  // ====================
  useEffect(() => {
    loadUserData();
  }, []);

  // Recalculate safe balance when total balance or packets change
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
      
      // Initialize balances from user data
      setTotalBalance(currentUser.balance);
      
      // Calculate derived balances
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

  const handleNotificationPress = (): void => {
    console.log('Notifications pressed');
  };

  const handleSettingsPress = (): void => {
    console.log('Settings pressed');
  };

  const handlePacketPress = (packetId: number): void => {
    console.log(`Packet ${packetId} pressed`);
  };

  const handleToggleBalance = (): void => {
    setShowTotalBalance(!showTotalBalance);
  };

  // Open balance edit modal
  const openBalanceModal = (): void => {
    setOperationType('add');
    setAmountInput('');
    setDescription('');
    setShowBalanceModal(true);
  };

  // Execute balance operation
  const handleBalanceOperation = (): void => {
    // Validate input using business logic
    const validation = validateAmount(amountInput);
    if (!validation.isValid || !validation.amount) {
      Alert.alert('Invalid Amount', validation.message || 'Please enter a valid amount');
      return;
    }

    // Update total balance using business logic
    const result = updateTotalBalance(totalBalance, operationType, validation.amount);
    if (!result.isValid) {
      Alert.alert('Operation Failed', result.message || 'Unable to process operation');
      return;
    }

    // Create transaction record
    const transaction = createTransaction(operationType, validation.amount, description);
    
    // Update UI state
    setTotalBalance(result.newTotalBalance);
    setShowBalanceModal(false);
    setAmountInput('');
    setDescription('');

    // Show success message
    const operationText = operationType === 'add' ? 'added to' : 'subtracted from';
    Alert.alert(
      'Success',
      `${formatCurrencyDisplay(validation.amount, 'PHP').full} ${operationText} your total balance`,
      [{ text: 'OK' }]
    );
    
    console.log('Transaction:', transaction);
  };

  // Format input as user types
  const handleAmountChange = (text: string): void => {
    const formatted = formatInputAmount(text);
    setAmountInput(formatted);
  };

  // Quick set amount
  const setQuickAmount = (amount: number): void => {
    setAmountInput(amount.toString());
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
  const allocatedDisplay = formatCurrencyDisplay(allocatedAmount, 'PHP');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TOP NAVBAR */}
      <View style={styles.topNavbar}>
        <View style={styles.navLeft}>
          <Text style={styles.appLogo}>WAIS WALLET</Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* FULL BALANCE CARD */}
        <View style={styles.fullBalanceCard}>
          {/* Greeting and Email - SYNCED WITH SCRIPTS DATA */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardGreeting}>HELLO, {user.name.toUpperCase()}!</Text>
            <Text style={styles.cardEmail}>{user.email.toLowerCase()}</Text>
          </View>
          
          {/* Total Balance - Clickable dots/numbers */}
          <View style={styles.balanceRow}>
            <View style={styles.balanceLabelContainer}>
              <Text style={styles.balanceLabel}>Total Balance:</Text>
              <Text style={styles.balanceSubLabel}>
                (Click to show/hide)
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.totalBalanceContainer}
              onPress={handleToggleBalance}
              activeOpacity={0.7}
            >
              {showTotalBalance ? (
                <Text style={styles.totalBalance}>{totalBalanceDisplay.full}</Text>
              ) : (
                <View style={styles.dotsContainer}>
                  <Text style={styles.dotsText}>••••••••</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Edit Button for Total Balance */}
          <View style={styles.balanceEditRow}>
            <TouchableOpacity 
              style={styles.editBalanceButton}
              onPress={openBalanceModal}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#A0C1D1" />
              <Text style={styles.editBalanceText}>Edit Total Balance</Text>
            </TouchableOpacity>
          </View>
          
          {/* Balance Breakdown */}
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Allocated to Pockets:</Text>
              <Text style={styles.breakdownValue}>{allocatedDisplay.full}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Safe Balance:</Text>
              <Text style={[styles.breakdownValue, styles.safeBalanceHighlight]}>
                {safeBalanceDisplay.full}
              </Text>
            </View>
            <View style={styles.breakdownNote}>
              <Text style={styles.breakdownNoteText}>
                Safe Balance = Total Balance - Allocated Pockets
              </Text>
            </View>
          </View>
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

      {/* BALANCE EDIT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBalanceModal}
        onRequestClose={() => setShowBalanceModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Total Balance</Text>
              <TouchableOpacity 
                onPress={() => setShowBalanceModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Operation Type Toggle */}
            <View style={styles.operationToggle}>
              <TouchableOpacity 
                style={[
                  styles.operationButton,
                  operationType === 'add' && styles.operationButtonActive
                ]}
                onPress={() => setOperationType('add')}
              >
                <Ionicons 
                  name="add-circle" 
                  size={20} 
                  color={operationType === 'add' ? '#4CAF50' : '#999'} 
                />
                <Text style={[
                  styles.operationButtonText,
                  operationType === 'add' && styles.operationButtonTextActive
                ]}>
                  Add
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.operationButton,
                  operationType === 'subtract' && styles.operationButtonActive
                ]}
                onPress={() => setOperationType('subtract')}
              >
                <Ionicons 
                  name="remove-circle" 
                  size={20} 
                  color={operationType === 'subtract' ? '#F44336' : '#999'} 
                />
                <Text style={[
                  styles.operationButtonText,
                  operationType === 'subtract' && styles.operationButtonTextActive
                ]}>
                  Subtract
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {operationType === 'add' 
                ? 'Add money to your total balance:' 
                : 'Subtract money from your total balance:'}
            </Text>
            
            {/* Current Balances */}
            <View style={styles.currentBalances}>
              <View style={styles.currentBalanceRow}>
                <Text style={styles.currentBalanceLabel}>Current Total:</Text>
                <Text style={styles.currentBalanceValue}>{totalBalanceDisplay.full}</Text>
              </View>
              <View style={styles.currentBalanceRow}>
                <Text style={styles.currentBalanceLabel}>Current Safe:</Text>
                <Text style={styles.currentBalanceValue}>{safeBalanceDisplay.full}</Text>
              </View>
            </View>
            
            {/* Amount Input */}
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₱</Text>
              <TextInput
                style={styles.amountInput}
                value={amountInput}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                keyboardType="decimal-pad"
                autoFocus
                placeholderTextColor="#999"
              />
            </View>
            
            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(100)}
              >
                <Text style={styles.quickAmountText}>₱100</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(500)}
              >
                <Text style={styles.quickAmountText}>₱500</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(1000)}
              >
                <Text style={styles.quickAmountText}>₱1,000</Text>
              </TouchableOpacity>
            </View>
            
            {/* Description Input */}
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor="#999"
            />
            
            {/* Action Button */}
            <TouchableOpacity 
              style={[
                styles.modalActionButton,
                operationType === 'add' ? styles.addActionButton : styles.subtractActionButton,
                amountInput === '' && styles.modalActionButtonDisabled
              ]}
              onPress={handleBalanceOperation}
              disabled={amountInput === ''}
            >
              <Text style={styles.modalActionButtonText}>
                {operationType === 'add' ? 'Add Money' : 'Subtract Money'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* BOTTOM NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Home pressed')}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.navItemTextActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Budget pressed')}>
          <Ionicons name="pie-chart-outline" size={24} color="#8E8E93" />
          <Text style={styles.navItemText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Cards pressed')}>
          <Ionicons name="card-outline" size={24} color="#8E8E93" />
          <Text style={styles.navItemText}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('Profile pressed')}>
          <Ionicons name="person-outline" size={24} color="#8E8E93" />
          <Text style={styles.navItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;