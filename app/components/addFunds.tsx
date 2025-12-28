import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  validateAmount,
} from '../scripts/home';
import styles from '../styles/addFundsStyle';
import {
  DestinationType,
  Packet,
  Transaction,
  User,
} from '../types';
import {
  addToBalance,
  addToPocket,
  getPockets,
  getUser,
} from '../utils/mmkvStorage';

const AddFundsScreen: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationType>('safe_balance');
  const [selectedPocket, setSelectedPocket] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [note, setNote] = useState('');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPocketDropdown, setShowPocketDropdown] = useState(false);
  const [successTransaction, setSuccessTransaction] = useState<Transaction | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load latest user and pockets
  useEffect(() => {
    const loadData = () => {
      const storedUser = getUser();
      const storedPockets = getPockets();
      setUser(storedUser);
      setPockets(storedPockets);
    };
    loadData();
  }, []);

  // Destination handlers
  const handleSelectDestination = (type: DestinationType) => {
    setSelectedDestination(type);
    setShowDestinationDropdown(false);
    if (type === 'pocket' && !selectedPocket) {
      setShowPocketDropdown(true);
    }
  };

  const handleSelectPocket = (pocketId: string) => {
    setSelectedPocket(pocketId);
    setShowPocketDropdown(false);
  };

  const getSelectedPocketName = () => {
    if (!selectedPocket) return '';
    const pocket = pockets.find((p) => p.id === selectedPocket);
    return pocket ? pocket.name : '';
  };

  const getDestinationAmountDisplay = () => {
    const currency = user?.currency || 'PHP';
    if (selectedDestination === 'safe_balance') {
      return formatCurrencyDisplay(user?.balance || 0, currency).full;
    }
    if (selectedDestination === 'pocket' && selectedPocket) {
      const pocket = pockets.find((p) => p.id === selectedPocket);
      return pocket ? formatCurrencyDisplay(pocket.amount, currency).full : 'Select Pocket';
    }
    return 'Select Pocket';
  };

  const handleFundAmountChange = (text: string) => {
    setFundAmount(formatInputAmount(text));
  };

  // Add funds logic
  const addFunds = async (
    amount: number,
    destination: DestinationType,
    pocketId?: string
  ) => {
    if (!user) return;

    const latestUser = getUser();
    const latestPockets = getPockets();
    if (!latestUser) return;

    if (destination === 'safe_balance') {
      addToBalance(amount);
    }

    if (destination === 'pocket' && pocketId) {
      const pocket = latestPockets.find((p) => p.id === pocketId);
      if (!pocket) {
        Alert.alert('Error', 'Selected pocket not found.');
        return;
      }
      if (latestUser.balance < amount) {
        Alert.alert('Insufficient Balance', 'Not enough safe balance.');
        return;
      }
      addToPocket(pocketId, amount);
    }

    return {
      amount,
      destination,
      destinationName:
        destination === 'safe_balance'
          ? 'Safe Balance'
          : latestPockets.find((p) => p.id === pocketId)?.name || 'Pocket',
      date: new Date().toISOString(),
      note: note || undefined,
    };
  };

  const handleSubmit = async () => {
    const validation = validateAmount(fundAmount);

    if (!validation.isValid) {
      return Alert.alert('Invalid Amount', validation.message || 'Enter a valid amount');
    }

    if (selectedDestination === 'pocket' && !selectedPocket) {
      return Alert.alert('Select Pocket', 'Please select a pocket');
    }

    const transaction = await addFunds(
      validation.amount!,
      selectedDestination,
      selectedDestination === 'pocket' ? selectedPocket! : undefined
    );

    if (!transaction) return;

    setSuccessTransaction(transaction);
    setShowSuccessModal(true);
    // Refresh user/pockets state
    setUser(getUser());
    setPockets(getPockets());
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const handleBack = () => router.back();

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#0f4248" />
        </TouchableOpacity>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.container}>
        {/* DESTINATION */}
        <Text style={styles.sectionLabel}>Add Funds:</Text>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            selectedDestination && styles.inputContainerSelected,
          ]}
          onPress={() => setShowDestinationDropdown(true)}
        >
          <View style={styles.dropdownSelected}>
            <Text style={styles.dropdownSelectedText}>
              <Text style={styles.sectionLabel1}>To</Text>
              {'\n\n'}
              {selectedDestination === 'safe_balance' ? 'Safe Balance' : 'Pocket'}
            </Text>
            <Text style={styles.dropdownSelectedAmount}>
              {getDestinationAmountDisplay()}
            </Text>
          </View>
          <Icon name="chevron-down" size={20} color="#0f4248" />
        </TouchableOpacity>

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
                    pockets.find((p) => p.id === selectedPocket)?.amount || 0,
                    user?.currency || 'PHP'
                  ).full}
                </Text>
              )}
            </View>
            <Icon name="chevron-down" size={20} color="#0f4248" />
          </TouchableOpacity>
        )}

        {/* AMOUNT */}
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
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
        </View>

        {/* NOTE */}
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
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SUCCESS MODAL */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="slide"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Icon name="checkmark-circle" size={60} color="#4CAF50" />
            </View>

            <Text style={styles.successTitle}>Top up successful!</Text>

            <View style={styles.transactionDetailsBox}>
              <Text>Transferred to: {successTransaction?.destinationName}</Text>
              <Text>
                Amount:{' '}
                {successTransaction
                  ? formatCurrencyDisplay(
                      successTransaction.amount,
                      user?.currency || 'PHP'
                    ).full
                  : ''}
              </Text>
              <Text>
                Date:{' '}
                {successTransaction ? formatDate(successTransaction.date) : ''}
              </Text>
              {successTransaction?.note && <Text>Note: {successTransaction.note}</Text>}
            </View>

            <TouchableOpacity
              style={styles.goHomeButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.goHomeButtonText}>Go back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddFundsScreen;
