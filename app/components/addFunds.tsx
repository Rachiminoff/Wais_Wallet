import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  formatCurrencyDisplay,
  formatInputAmount,
  validateAmount
} from '../scripts/home';
import styles from '../styles/addFundsStyle';

// Define types for the destination
type DestinationType = 'safe_balance' | 'pocket';
interface Destination {
  id: number;
  type: DestinationType;
  name: string;
  amount: number;
  available?: boolean;
}

interface Transaction {
  amount: number;
  destination: string;
  destinationName: string;
  date: Date;
  note?: string;
}

const AddFundsScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  
  // Hide default Expo Router header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  // State for destination selection
  const [selectedDestination, setSelectedDestination] = useState<DestinationType>('safe_balance');
  const [selectedPocket, setSelectedPocket] = useState<number | null>(null);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPocketDropdown, setShowPocketDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // State for form inputs
  const [fundAmount, setFundAmount] = useState('');
  const [note, setNote] = useState('');
  
  // Success transaction state
  const [successTransaction, setSuccessTransaction] = useState<Transaction | null>(null);
  
  // Mock data - in real app, this would come from props or context
  const [userBalance, setUserBalance] = useState(10000); // Example balance
  const [pockets, setPockets] = useState([
    { id: 1, name: 'Rent', amount: 2000.00 },
    { id: 2, name: 'Bills', amount: 1000.00 },
    { id: 3, name: 'Grocery', amount: 1500.00 },
    { id: 4, name: 'Pang-Gala', amount: 500.00 },
    { id: 5, name: 'Transportation', amount: 700.00 },
    { id: 6, name: 'Savings', amount: 3000.00 },
  ]);

  // Calculate safe balance
  const calculateSafeBalance = () => {
    const allocatedAmount = pockets.reduce((sum, pocket) => sum + pocket.amount, 0);
    return userBalance - allocatedAmount;
  };

  // Destination options
  const destinationOptions = [
    {
      id: 1,
      type: 'safe_balance' as DestinationType,
      name: 'Safe Balance',
      amount: calculateSafeBalance(),
      available: true,
    },
    {
      id: 2,
      type: 'pocket' as DestinationType,
      name: 'Pocket',
      amount: 0, // Will show selected pocket amount
      available: true,
    },
  ];

  // Handle destination selection
  const handleSelectDestination = (type: DestinationType) => {
    setSelectedDestination(type);
    setShowDestinationDropdown(false);
    
    // If selecting pocket but no pocket selected yet, show pocket dropdown
    if (type === 'pocket' && !selectedPocket) {
      setShowPocketDropdown(true);
    }
  };

  // Handle pocket selection
  const handleSelectPocket = (pocketId: number) => {
    setSelectedPocket(pocketId);
    setShowPocketDropdown(false);
  };

  // Format amount display
  const getDestinationAmountDisplay = () => {
    if (selectedDestination === 'safe_balance') {
      return formatCurrencyDisplay(calculateSafeBalance(), 'PHP').full;
    } else if (selectedDestination === 'pocket' && selectedPocket) {
      const pocket = pockets.find(p => p.id === selectedPocket);
      return pocket ? formatCurrencyDisplay(pocket.amount, 'PHP').full : 'Select Pocket';
    }
    return 'Select Pocket';
  };

  // Get selected pocket name
  const getSelectedPocketName = () => {
    if (selectedPocket) {
      const pocket = pockets.find(p => p.id === selectedPocket);
      return pocket ? pocket.name : '';
    }
    return '';
  };

  // Handle fund amount input
  const handleFundAmountChange = (text: string) => {
    const formatted = formatInputAmount(text);
    setFundAmount(formatted);
  };

  // Actual function to add funds
  const addFunds = (amount: number, destination: DestinationType, pocketId?: number) => {
    // In a real app, this would be an API call
    // For now, we'll simulate the update
    
    if (destination === 'safe_balance') {
      // Add to user balance (safe balance)
      setUserBalance(prev => prev + amount);
    } else if (destination === 'pocket' && pocketId) {
      // Add to selected pocket
      setPockets(prev => prev.map(pocket => 
        pocket.id === pocketId 
          ? { ...pocket, amount: pocket.amount + amount }
          : pocket
      ));
    }
    
    // Return success transaction
    return {
      amount,
      destination: destination === 'safe_balance' ? 'safe_balance' : 'pocket',
      destinationName: destination === 'safe_balance' ? 'Safe Balance' : getSelectedPocketName(),
      date: new Date(),
      note: note || undefined
    };
  };

  // Validate and submit
  const handleSubmit = () => {
    // Validate amount
    const amountValidation = validateAmount(fundAmount);
    if (!amountValidation.isValid) {
      Alert.alert('Invalid Amount', amountValidation.message || 'Please enter a valid amount');
      return;
    }

    // Validate destination
    if (selectedDestination === 'pocket' && !selectedPocket) {
      Alert.alert('Select Pocket', 'Please select a pocket to add funds to');
      return;
    }

    const amount = amountValidation.amount!;
    
    // Add funds
    const transaction = addFunds(
      amount, 
      selectedDestination, 
      selectedDestination === 'pocket' ? selectedPocket : undefined
    );
    
    // Set success transaction and show modal
    setSuccessTransaction(transaction);
    setShowSuccessModal(true);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back(); // Go back to home
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Render destination dropdown item
  const renderDestinationItem = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectDestination(item.type)}
    >
      <View style={styles.dropdownItemContent}>
        <Text style={styles.dropdownItemName}>{item.name}</Text>
        <Text style={styles.dropdownItemAmount}>
          {item.type === 'safe_balance' 
            ? formatCurrencyDisplay(item.amount, 'PHP').full
            : selectedPocket 
              ? formatCurrencyDisplay(
                  pockets.find(p => p.id === selectedPocket)?.amount || 0, 
                  'PHP'
                ).full
              : 'Select'
          }
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render pocket dropdown item
  const renderPocketItem = ({ item }: { item: typeof pockets[0] }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectPocket(item.id)}
    >
      <View style={styles.dropdownItemContent}>
        <Text style={styles.dropdownItemName}>{item.name}</Text>
        <Text style={styles.dropdownItemAmount}>
          {formatCurrencyDisplay(item.amount, 'PHP').full}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Icon name="arrow-back" size={24} color="#0f4248" />
        </TouchableOpacity>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Destination Section */}
        <Text style={styles.sectionLabel}>Add Funds: </Text>
        <View style={styles.section}>          
          {/* Destination Dropdown */}
          <TouchableOpacity
            style={[
              styles.inputContainer,
              selectedDestination && styles.inputContainerSelected,
            ]}
            onPress={() => setShowDestinationDropdown(true)}
          >
            <View style={styles.dropdownSelected}>
              <Text style={styles.dropdownSelectedText}>
                <Text style={styles.sectionLabel1}>To</Text><br></br><br></br>
                {selectedDestination === 'safe_balance' ? 'Safe Balance' : 'Pocket'}
              </Text>
              <Text style={styles.dropdownSelectedAmount}>
                {getDestinationAmountDisplay()}
              </Text>
            </View>
            <Icon name="chevron-down" size={20} color="#0f4248" />
          </TouchableOpacity>

          {/* Pocket Selection (only shown when pocket is selected) */}
          {selectedDestination === 'pocket' && (
            <TouchableOpacity
              style={[
                styles.inputContainer,
                styles.pocketInputContainer,
                selectedPocket && styles.inputContainerSelected,
              ]}
              onPress={() => setShowPocketDropdown(true)}
            >
              <View style={styles.dropdownSelected}>
                <Text style={styles.dropdownSelectedText}>
                  {selectedPocket ? getSelectedPocketName() : 'Select Pocket'}
                </Text>
                {selectedPocket && (
                  <Text style={styles.dropdownSelectedAmount}>
                    {formatCurrencyDisplay(
                      pockets.find(p => p.id === selectedPocket)?.amount || 0, 
                      'PHP'
                    ).full}
                  </Text>
                )}
              </View>
              <Icon name="chevron-down" size={20} color="#0f4248" />
            </TouchableOpacity>
          )}
        </View>

        {/* Fund Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Fund Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <TextInput
              style={[
                styles.amountInput,
                fundAmount !== '' && styles.inputContainerSelected,
              ]}
              value={fundAmount}
              onChangeText={handleFundAmountChange}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Note (optional)</Text>
          <TextInput
            style={[
              styles.noteInput,
              note !== '' && styles.inputContainerSelected,
            ]}
            value={note}
            onChangeText={setNote}
            placeholder="Enter note"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Destination Dropdown Modal */}
      <Modal
        visible={showDestinationDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDestinationDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination</Text>
              <TouchableOpacity onPress={() => setShowDestinationDropdown(false)}>
                <Icon name="close" size={24} color="#0f4248" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={destinationOptions}
              renderItem={renderDestinationItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.dropdownList}
            />
          </View>
        </View>
      </Modal>

      {/* Pocket Dropdown Modal */}
      <Modal
        visible={showPocketDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPocketDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pocket</Text>
              <TouchableOpacity onPress={() => setShowPocketDropdown(false)}>
                <Icon name="close" size={24} color="#0f4248" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={pockets}
              renderItem={renderPocketItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.dropdownList}
            />
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="slide"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successModalContent}>
              {/* Success Icon */}
              <View style={styles.successIconContainer}>
                <Icon name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              
              {/* Success Title */}
              <Text style={styles.successTitle}>Top up successful!</Text>
              
              {/* Transaction Details Box */}
              <View style={styles.transactionDetailsBox}>
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Transferred to:</Text>
                  <Text style={styles.transactionDetailValue}>
                    {successTransaction?.destinationName}
                  </Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Amount:</Text>
                  <Text style={[styles.transactionDetailValue, styles.amountValue]}>
                    {successTransaction ? formatCurrencyDisplay(successTransaction.amount, 'PHP').full : ''}
                  </Text>
                </View>
                
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Date:</Text>
                  <Text style={styles.transactionDetailValue}>
                    {successTransaction ? formatDate(successTransaction.date) : ''}
                  </Text>
                </View>
                
                {successTransaction?.note && (
                  <View style={styles.transactionDetailRow}>
                    <Text style={styles.transactionDetailLabel}>Note:</Text>
                    <Text style={styles.transactionDetailValue}>
                      {successTransaction.note}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Go Back to Home Button */}
              <TouchableOpacity
                style={styles.goHomeButton}
                onPress={handleSuccessModalClose}
                activeOpacity={0.8}
              >
                <Text style={styles.goHomeButtonText}>Go back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddFundsScreen;