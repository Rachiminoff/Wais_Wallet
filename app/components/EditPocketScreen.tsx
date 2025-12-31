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

import styles from '../styles/editPocketStyles';
import { Packet } from '../types';
import {
  deletePocket,
  getPockets,
  updatePocket,
} from '../utils/mmkvStorage';

export default function EditPocketScreen() {
  const router = useRouter();

  const [pockets, setPockets] = useState<Packet[]>([]);
  const [selectedPocket, setSelectedPocket] =
    useState<Packet | null>(null);

  const [editedName, setEditedName] = useState('');
  const [editedAmount, setEditedAmount] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    setShowEditModal(true);
  };

  /* ====================
     CONFIRM EDIT
  ==================== */
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
        Number(editedAmount)
      );

      setPockets(getPockets());

      setShowConfirmModal(false);
      setSelectedPocket(null);

      Alert.alert('Success', 'Pocket updated');
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
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#0f3d3e" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Pocket</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={styles.columnLeft}>Pocket Name</Text>
        <Text style={styles.columnRight}>Amount</Text>
      </View>

      {/* POCKET LIST */}
      <ScrollView>
        {pockets.map((pocket) => (
          <View key={pocket.id} style={styles.row}>
            <Text style={styles.pocketName}>{pocket.name}</Text>

            <View style={styles.amountCell}>
              <Text>₱{pocket.amount.toLocaleString()}</Text>

              <TouchableOpacity
                onPress={() => startEdit(pocket)}
                hitSlop={10}
              >
                <Icon
                  name="pencil-outline"
                  size={18}
                  color="#6c7c7c"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDelete(pocket)}
                hitSlop={10}
              >
                <Icon
                  name="trash-outline"
                  size={18}
                  color="#d9534f"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ====================
          EDIT MODAL
      ==================== */}
      <Modal transparent visible={showEditModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              Edit Pocket
            </Text>

            {/* NAME */}
            <Text style={styles.inputLabel}>Pocket Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Pocket name"
            />

            {/* AMOUNT */}
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={editedAmount}
              onChangeText={setEditedAmount}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={proceedToConfirm}
              >
                <Text style={styles.confirmText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================
          CONFIRM MODAL
      ==================== */}
      <Modal transparent visible={showConfirmModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              Confirm Changes
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                This will update your pocket name and
                balance immediately. Are you sure?
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSave}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================
          DELETE MODAL
      ==================== */}
      <Modal transparent visible={showDeleteModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              Delete "{selectedPocket?.name}"?
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This will permanently delete this pocket.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDelete}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
