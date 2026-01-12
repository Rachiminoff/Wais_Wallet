import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useTheme } from './context/ThemeContext';
import styles from './styles/savingsStyles';
import { Packet, SavingsGoal } from './types';
import { addToSavings, archiveSavingsGoal, getPockets, getSavings, getUser, unarchiveSavingsGoal } from './utils/mmkvStorage';

/* =========================
   SAVINGS SCREEN
========================= */

export default function SavingsScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  /* =========================
     STATE
  ========================= */

  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [pockets, setPockets] = useState<Packet[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [sourcePocketId, setSourcePocketId] = useState<string | number>('safe_balance');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */

  useFocusEffect(
    useCallback(() => {
      setSavings(getSavings());
      setPockets(getPockets());
    }, [])
  );

  /* =========================
     UI
  ========================= */

  return (
    <ThemeWrapper>
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
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
          Savings
        </Text>
      </View>

      {/* =========================
          SAVINGS LIST
      ========================= */}

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* NEW GOAL BUTTON */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.addGoalButton]}
          onPress={() => router.push('/components/NewSavingsGoalScreen')}
        >
          <Icon name="add-circle" size={22} color="#FFF" />
          <Text
            style={[
              styles.primaryButtonText,
              { fontFamily: font.family },
            ]}
          >
            New Goal
          </Text>
        </TouchableOpacity>

        {/* TRANSACTION HISTORY BUTTON */}
        <TouchableOpacity
          style={[{
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            borderWidth: 1,
            flexDirection: 'row',
            gap: 8,
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => router.push('/components/transactions')}
        >
          <Icon name="time-outline" size={22} color={colors.text} />
          <Text style={[{
            fontSize: 14,
            fontWeight: '600',
            letterSpacing: 0.3,
            color: colors.text,
          }]}>Transaction History</Text>
        </TouchableOpacity>

        {/* SHOW ARCHIVED TOGGLE */}
        <TouchableOpacity
          style={[{
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            borderWidth: 1,
            flexDirection: 'row',
            gap: 8,
            backgroundColor: showArchived ? '#1C2B3A' : colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => setShowArchived(!showArchived)}
        >
          <Icon name={showArchived ? 'archive' : 'archive-outline'} size={22} color={showArchived ? '#FFF' : colors.text} />
          <Text style={[{ fontSize: 14, fontWeight: '600', letterSpacing: 0.3, color: showArchived ? '#FFF' : colors.text }]}>
            {showArchived ? 'Showing Archived' : 'Show Archived'}
          </Text>
        </TouchableOpacity>

        {savings.filter(g => showArchived ? g.archived : !g.archived).length === 0 && (
          <Text
            style={[
              styles.emptyText,
              { color: colors.muted },
            ]}
          >
            {showArchived ? 'No archived savings goals.' : 'No savings goals yet.'}
          </Text>
        )}

        {savings.filter(g => showArchived ? g.archived : !g.archived).map(goal => {
          const progress = goal.targetAmount > 0
            ? goal.currentAmount / goal.targetAmount
            : 0;

          const percent = Math.min(
            Math.max(Math.round(progress * 100), 0),
            100
          );

          return (
            <View
              key={goal.id}
              style={[
                styles.card,
                { backgroundColor: colors.card },
              ]}
            >
              {/* CARD HEADER */}
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.goalName,
                    { color: colors.text },
                  ]}
                >
                  {goal.name}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        '/components/EditSavingsGoalScreen',
                      params: { id: goal.id },
                    })
                  }
                >
                  <Icon
                    name="pencil-sharp"
                    size={18}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* AMOUNTS */}
              <View style={styles.amountRow}>
                <Text
                  style={[
                    styles.currentAmount,
                    { color: colors.text },
                  ]}
                >
                  ₱{goal.currentAmount.toLocaleString()}
                </Text>

                <Text
                  style={[
                    styles.targetAmount,
                    { color: colors.muted },
                  ]}
                >
                  / ₱{goal.targetAmount.toLocaleString()}
                </Text>
              </View>

              {/* PROGRESS BAR */}
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percent}%` },
                  ]}
                >
                  <Text style={styles.progressText}>
                    {percent}%
                  </Text>
                </View>
              </View>

              {/* ACTION */}
              <TouchableOpacity
                style={[styles.addSavingsButton, { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: percent >= 100 ? '#4CAF50' : '#1C2B3A' }]}
                onPress={() => {
                  if (percent >= 100) {
                    archiveSavingsGoal(goal.id);
                    setSavings(getSavings());
                  } else {
                    setSelectedGoalId(goal.id);
                    setShowAddModal(true);
                  }
                }}
              >
                <Icon name={percent >= 100 ? 'checkmark-circle' : 'add-circle'} size={20} color="#FFF" />
                <Text style={styles.addSavingsText}>
                  {percent >= 100 ? 'Complete' : 'Add Savings'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* ================= ADD SAVINGS MODAL ================= */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 24, width: '85%', maxWidth: 400 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 20 }}>
              Add to {savings.find(g => g.id === selectedGoalId)?.name}
            </Text>

            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>
              Amount to Add
            </Text>

            <TextInput
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: colors.text,
                backgroundColor: colors.background,
                marginBottom: 16,
              }}
            />

            <View style={[showSourceDropdown && { marginBottom: 0 }, { paddingBottom: 16 }]}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>
                Source
              </Text>
              <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    backgroundColor: colors.background,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomLeftRadius: showSourceDropdown ? 0 : 10,
                    borderBottomRightRadius: showSourceDropdown ? 0 : 10,
                  }}
                  onPress={() => setShowSourceDropdown(!showSourceDropdown)}
                >
                  <Text style={{ color: colors.text, fontSize: 14 }}>
                    {sourcePocketId === 'safe_balance' 
                      ? 'Safe Balance' 
                      : pockets.find(p => p.id === sourcePocketId)?.name || 'Select source'}
                  </Text>
                  <Icon 
                    name={showSourceDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.text} 
                  />
                </TouchableOpacity>

                {showSourceDropdown && (
                  <View
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderTopWidth: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      maxHeight: 250,
                      marginBottom: 20,
                    }}
                  >
                    <ScrollView
                      style={{ maxHeight: 250 }}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 16,
                          paddingHorizontal: 16,
                          borderBottomWidth: 0.5,
                          borderBottomColor: colors.border,
                        }}
                        onPress={() => {
                          setSourcePocketId('safe_balance');
                          setShowSourceDropdown(false);
                        }}
                      >
                        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '500' }}>
                          Safe Balance
                        </Text>
                        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
                          {getUser()?.balance.toFixed(2)}
                        </Text>
                      </TouchableOpacity>

                      {pockets.map((pocket) => (
                        <TouchableOpacity
                          key={pocket.id}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                            borderBottomWidth: 0.5,
                            borderBottomColor: colors.border,
                          }}
                          onPress={() => {
                            setSourcePocketId(pocket.id);
                            setShowSourceDropdown(false);
                          }}
                        >
                          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '500' }}>
                            {pocket.name}
                          </Text>
                          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>
                            {pocket.amount.toFixed(2)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: showSourceDropdown ? 20 : 4 }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: colors.background }}
                onPress={() => {
                  setShowAddModal(false);
                  setAddAmount('');
                  setSelectedGoalId(null);
                  setSourcePocketId('safe_balance');
                  setShowSourceDropdown(false);
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#1C2B3A' }}
                onPress={() => {
                  const value = Number(addAmount);
                  if (isNaN(value) || value <= 0) {
                    setErrorMessage('Please enter a valid amount');
                    setShowErrorModal(true);
                    return;
                  }

                  // Check if amount exceeds source balance
                  const user = getUser();
                  if (sourcePocketId === 'safe_balance') {
                    if (user && value > user.balance) {
                      setErrorMessage(`Insufficient Safe Balance. Available: ₱${user.balance.toFixed(2)}`);
                      setShowErrorModal(true);
                      return;
                    }
                  } else {
                    const pocket = pockets.find(p => p.id === sourcePocketId);
                    if (pocket && value > pocket.amount) {
                      setErrorMessage(`Insufficient ${pocket.name} balance. Available: ₱${pocket.amount.toFixed(2)}`);
                      setShowErrorModal(true);
                      return;
                    }
                  }

                  try {
                    addToSavings(selectedGoalId!, value, sourcePocketId);
                    setShowAddModal(false);
                    setAddAmount('');
                    setSelectedGoalId(null);
                    setSourcePocketId('safe_balance');
                    setShowSourceDropdown(false);
                    setSavings(getSavings());
                    setPockets(getPockets());
                    setShowSuccessModal(true);
                  } catch (err: any) {
                    setErrorMessage(err.message ?? 'Something went wrong');
                    setShowErrorModal(true);
                  }
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= SUCCESS MODAL ================= */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 32, width: '85%', maxWidth: 400, alignItems: 'center' }}>
            <Image
              source={require('../assets/successOwl.png')}
              style={{ width: 120, height: 120, marginBottom: 20 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
              Transfer Successful
            </Text>
            <View style={{ backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 20, width: '100%' }}>
              <Text style={{ color: colors.text, textAlign: 'center' }}>
                Savings added successfully.
              </Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#1C2B3A', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%' }}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= ERROR MODAL ================= */}
      <Modal visible={showErrorModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 32, width: '85%', maxWidth: 400, alignItems: 'center' }}>
            <Image
              source={require('../assets/unsuccessfulOwl.png')}
              style={{ width: 120, height: 120, marginBottom: 20 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
              Transfer Unsuccessful
            </Text>
            <View style={{ backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 20, width: '100%' }}>
              <Text style={{ color: colors.text, textAlign: 'center' }}>
                {errorMessage}
              </Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#1C2B3A', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%' }}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavbar />
    </ThemeWrapper>
  );
}

