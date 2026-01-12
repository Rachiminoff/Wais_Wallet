import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/newSavingsStyles';
import { Packet } from '../types';
import { createSavingsGoal, getPockets, getUser } from '../utils/mmkvStorage';

export default function NewSavingsGoalScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  const [pockets, setPockets] = useState<Packet[]>([]);
  const user = getUser();

  React.useEffect(() => {
    setPockets(getPockets());
  }, []);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startingAmount, setStartingAmount] = useState('');
  const [sourcePocketId, setSourcePocketId] = useState<string | number>('safe_balance');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = () => {
    try {
      if (!name.trim()) throw new Error('Goal name is required');

      const target = Number(targetAmount);
      const start = Number(startingAmount || 0);

      if (isNaN(target) || target <= 0)
        throw new Error('Invalid target amount');

      if (isNaN(start) || start < 0)
        throw new Error('Invalid starting amount');

      if (start > target)
        throw new Error('Starting amount cannot exceed target');

      setConfirmVisible(true);
    } catch (err: any) {
      setErrorMessage(err.message);
      setErrorVisible(true);
    }
  };

  const handleCreate = () => {
    try {
      const target = Number(targetAmount);
      const start = Number(startingAmount || 0);

      createSavingsGoal(name.trim(), target, start, start > 0 ? sourcePocketId : undefined);

      setConfirmVisible(false);
      setSuccessVisible(true);
    } catch (err: any) {
      setConfirmVisible(false);
      setErrorMessage(err.message);
      setErrorVisible(true);
    }
  };

  return (
    <ThemeWrapper>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: 50 },
        ]}
      >
        {/* ================= HEADER ================= */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Icon
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: font + 4, fontWeight: '700' },
            ]}
          >
            New Savings Goal
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* ================= FORM ================= */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[styles.label, { color: colors.text }]}>
            Goal Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="e.g. New Laptop"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Target Amount
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            value={targetAmount}
            onChangeText={setTargetAmount}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Starting Amount (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            value={startingAmount}
            onChangeText={setStartingAmount}
          />

          {Number(startingAmount || 0) > 0 && (
            <View style={[showSourceDropdown && { marginBottom: 0 }]}>
              <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
                Source
              </Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomLeftRadius: showSourceDropdown ? 0 : 10,
                    borderBottomRightRadius: showSourceDropdown ? 0 : 10,
                  },
                ]}
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
                  style={[
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderTopWidth: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      maxHeight: 250,
                      marginBottom: 20,
                    },
                  ]}
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
                        {user?.balance.toFixed(2)}
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
          )}
        </View>

        {/* ================= ACTIONS ================= */}
        <TouchableOpacity
          style={[{
            backgroundColor: '#0f4248',
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: 'center',
            marginTop: 28,
            marginHorizontal: 20,
            opacity: (!name.trim() || !targetAmount || Number(targetAmount) <= 0) ? 0.5 : 1,
          }]}
          disabled={!name.trim() || !targetAmount || Number(targetAmount) <= 0}
          onPress={handleContinue}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Continue</Text>
        </TouchableOpacity>

      {/* ================= CONFIRMATION MODAL ================= */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 24,
            width: '85%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
              color: colors.text,
              textAlign: 'center',
            }}>
              Confirm Savings Goal
            </Text>

            <View style={{
              backgroundColor: colors.background,
              padding: 14,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#0f4248',
              marginBottom: 24,
            }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  Goal
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  {name}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  Target Amount
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  ₱{Number(targetAmount).toFixed(2)}
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
                  Starting Amount
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  ₱{Number(startingAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.border,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#0f4248',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={handleCreate}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= SUCCESS MODAL ================= */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            width: '85%',
            maxWidth: 400,
            alignItems: 'center',
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}>
            <Image
              source={require('../../assets/successOwl.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginBottom: 12,
              }}
            />

            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 24,
              color: colors.text,
              textAlign: 'center',
            }}>
              Goal Created Successfully!
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#0f4248',
                paddingVertical: 14,
                paddingHorizontal: 30,
                borderRadius: 12,
                width: '80%',
                alignItems: 'center',
              }}
              onPress={() => {
                setSuccessVisible(false);
                router.back();
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= ERROR BOTTOM SHEET ================= */}
      <Modal visible={errorVisible} transparent animationType="fade">
        <View style={styles.sheetOverlay}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.card },
            ]}
          >
            <Image
              source={require('../../assets/unsuccessfulOwl.png')}
              style={styles.sheetImage}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.sheetTitle,
                { color: colors.text },
              ]}
            >
              Creation Failed
            </Text>

            <View
              style={[
                styles.sheetMessageBox,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  styles.sheetMessage,
                  { color: colors.text },
                ]}
              >
                {errorMessage}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => setErrorVisible(false)}
            >
              <Text style={styles.sheetButtonText}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </ThemeWrapper>
  );
}
