import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';
import styles from '../styles/editPocketStyles';
import { Packet } from '../types';
import {
    deletePocket,
    getPockets,
    getUser,
    updatePocket,
} from '../utils/mmkvStorage';

export default function EditPocketScreen() {
  const router = useRouter();
  const { colors, font } = useTheme();

  const [pockets, setPockets] = useState<Packet[]>([]);
  const [selectedPocket, setSelectedPocket] =
    useState<Packet | null>(null);

  const [editedName, setEditedName] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [adjustSafeBalance, setAdjustSafeBalance] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ====================
     LOAD POCKETS
  ==================== */
  useEffect(() => {
    setPockets(getPockets());
  }, []);

  /* ====================
     START EDIT
  ==================== */
  const startEdit = (pocket: Packet) => {
    setSelectedPocket(pocket);
    setEditedName(pocket.name);
    setEditedAmount(String(pocket.amount));
    setAdjustSafeBalance(false);
    setShowEditModal(true);
  };

  /* ====================
     CONFIRM EDIT
  ==================== */
  const hasChanges = () => {
    if (!selectedPocket) return false;
    return (
      editedName.trim() !== selectedPocket.name ||
      Number(editedAmount) !== selectedPocket.amount
    );
  };

  const amountDiff = selectedPocket
    ? Number(editedAmount || 0) - selectedPocket.amount
    : 0;

  const safeBalanceBefore = getUser()?.balance ?? 0;
  const safeBalanceAfter = safeBalanceBefore - amountDiff;

  const proceedToConfirm = () => {
    const value = Number(editedAmount);

    if (!editedName.trim()) {
      Alert.alert('Invalid name', 'Pocket name cannot be empty');
      return;
    }

    if (isNaN(value) || value < 0) {
      Alert.alert('Invalid amount');
      return;
    }

    setShowEditModal(false);
    setShowConfirmModal(true);
  };

  /* ====================
     APPLY SAVE
  ==================== */
  const handleSave = () => {
    if (!selectedPocket) return;

    try {
      updatePocket(
        selectedPocket.id,
        editedName.trim(),
        Number(editedAmount),
        adjustSafeBalance
      );

      setPockets(getPockets());

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  /* ====================
     DELETE
  ==================== */
  const confirmDelete = (pocket: Packet) => {
    setSelectedPocket(pocket);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!selectedPocket) return;

    deletePocket(selectedPocket.id);
    setPockets(getPockets());

    setShowDeleteModal(false);
    setSelectedPocket(null);
  };

  /* ====================
     UI
  ==================== */
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background, paddingTop: 30 },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card },
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
          Edit Pocket
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.border },
        ]}
      />

      {/* TABLE HEADER */}
      <View
        style={[
          styles.tableHeader,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.columnLeft,
            { color: colors.muted },
          ]}
        >
          Pocket Name
        </Text>
        <Text
          style={[
            styles.columnRight,
            { color: colors.muted },
          ]}
        >
          Amount
        </Text>
      </View>

      {/* POCKET LIST */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {pockets.map(pocket => (
          <View
            key={pocket.id}
            style={[
              styles.row,
              { backgroundColor: colors.card },
            ]}
          >
            <Text
              style={[
                styles.pocketName,
                { color: colors.text },
              ]}
            >
              {pocket.name}
            </Text>

            <View style={styles.amountCell}>
              <Text style={{ color: colors.text }}>
                ₱{pocket.amount.toLocaleString()}
              </Text>

              <TouchableOpacity
                onPress={() => startEdit(pocket)}
                hitSlop={15}
              >
                <Icon
                  name="pencil-outline"
                  size={18}
                  color={colors.muted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDelete(pocket)}
                hitSlop={15}
              >
                <Icon
                  name="trash-outline"
                  size={18}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ====================
          EDIT MODAL
      ==================== */}
      <Modal transparent visible={showEditModal} animationType="fade">
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalSheet,
                { backgroundColor: colors.card },
              ]}
            >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text },
              ]}
            >
              Edit Pocket
            </Text>

            <Text
              style={[
                styles.inputLabel,
                { color: colors.muted },
              ]}
            >
              Pocket Name
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Pocket name"
              placeholderTextColor={colors.muted}
            />

            <Text
              style={[
                styles.inputLabel,
                { color: colors.muted },
              ]}
            >
              Amount
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              keyboardType="numeric"
              value={editedAmount}
              onChangeText={setEditedAmount}
            />

            <View style={[styles.toggleRow, { borderColor: colors.border }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Adjust Safe Balance</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  When on, changes here will deduct/add from Safe Balance.
                </Text>
              </View>
              <Switch
                value={adjustSafeBalance}
                onValueChange={setAdjustSafeBalance}
                thumbColor={adjustSafeBalance ? '#0f4248' : '#f4f3f4'}
                trackColor={{ false: '#d9d9d9', true: '#9fb7bd' }}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: colors.muted },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !hasChanges() && { opacity: 0.5 },
                ]}
                disabled={!hasChanges()}
                onPress={proceedToConfirm}
              >
                <Text style={styles.confirmText}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ====================
          CONFIRM MODAL
      ==================== */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
          <View
            style={[
              styles.modalSheet,
              { 
                backgroundColor: colors.card,
                borderRadius: 24,
                width: '85%',
                maxWidth: 400,
                paddingHorizontal: 30,
                paddingVertical: 40,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, textAlign: 'center' },
              ]}
            >
              Confirm Changes
            </Text>

            <View
              style={[
                styles.infoBox,
                { backgroundColor: colors.background, marginBottom: 24 },
              ]}
            >
              {editedName.trim() !== selectedPocket?.name && (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.textMuted, fontSize: 13 },
                    ]}
                  >
                    Pocket Name
                  </Text>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.text, fontWeight: '600', fontSize: 15 },
                    ]}
                  >
                    {selectedPocket?.name} → {editedName}
                  </Text>
                </View>
              )}

              {Number(editedAmount) !== selectedPocket?.amount && (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.textMuted, fontSize: 13 },
                    ]}
                  >
                    Amount
                  </Text>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.text, fontWeight: '600', fontSize: 15 },
                    ]}
                  >
                    ₱{Number(selectedPocket?.amount ?? 0).toFixed(2)} → ₱{Number(editedAmount).toFixed(2)}
                  </Text>
                </View>
              )}

              {adjustSafeBalance && Number(editedAmount) !== selectedPocket?.amount && (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.textMuted, fontSize: 13 },
                    ]}
                  >
                    Safe Balance
                  </Text>
                  <Text
                    style={[
                      styles.infoText,
                      { color: colors.text, fontWeight: '600', fontSize: 15 },
                    ]}
                  >
                    ₱{safeBalanceBefore.toFixed(2)} → ₱{safeBalanceAfter.toFixed(2)}
                  </Text>
                </View>
              )}

              {!adjustSafeBalance && Number(editedAmount) !== selectedPocket?.amount && (
                <Text
                  style={[
                    styles.infoText,
                    { color: colors.textMuted, fontSize: 12, lineHeight: 16 },
                  ]}
                >
                  This directly changes the pocket's balance and won't be deducted from or added to other pockets.
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.border,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#1C2B3A',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={handleSave}
              >
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================
          SUCCESS MODAL
      ==================== */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
          <View
            style={[
              styles.modalSheet,
              { 
                backgroundColor: colors.card,
                borderRadius: 24,
                width: '85%',
                maxWidth: 400,
                alignItems: 'center',
                paddingVertical: 40,
              },
            ]}
          >
            <Image
              source={require('../../assets/successOwl.png')}
              style={{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginBottom: 12,
              }}
            />

            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, textAlign: 'center' },
              ]}
            >
              Pocket Updated!
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#1C2B3A',
                paddingVertical: 14,
                paddingHorizontal: 30,
                borderRadius: 12,
                marginTop: 24,
                width: '80%',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowSuccessModal(false);
                setSelectedPocket(null);
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ====================
          DELETE MODAL
      ==================== */}
      <Modal transparent visible={showDeleteModal} animationType="fade">
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalSheet,
                { backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.text, textAlign: 'center' },
                ]}
              >
                Delete "{selectedPocket?.name}"?
              </Text>

              <View
                style={[
                  styles.warningBox,
                  { 
                    backgroundColor: '#ffebee',
                    borderLeftColor: '#d32f2f',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.warningText,
                    { color: '#c62828', textAlign: 'center' },
                  ]}
                >
                  This will permanently delete this pocket. The remaining balance will be added to your Safe Balance.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text
                    style={[
                      styles.cancelText,
                      { color: colors.muted },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.confirmText}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
