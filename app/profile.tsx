import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomNavbar } from './components/BottomNavbar';
import { ThemeWrapper } from './components/ThemeWrapper';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import styles from './styles/profileStyles';

import {
  clearAllData,
  exportAppData,
  importAppData,
  logoutUser,
} from './utils/mmkvStorage';

/* ======================
   STORAGE
====================== */

const storage = createMMKV();
const PASSWORD_KEY = 'user_password';
const DELETE_PHRASE = 'DELETE EVERYTHING';

/* ======================
   PROFILE SCREEN
====================== */

const Profile: React.FC = () => {
  const router = useRouter();
  const { user: authUser, logout, updateUser } = useAuth();
  const { isDarkMode, toggleDarkMode, fontSize, colors } = useTheme();

  /* ======================
     STATE
  ====================== */

  const [changePwVisible, setChangePwVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newName, setNewName] = useState('');

  const [confirmPw, setConfirmPw] = useState('');
  const [deletePhrase, setDeletePhrase] = useState('');

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [successVisible, setSuccessVisible] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [onSuccessClose, setOnSuccessClose] =
    useState<(() => void) | null>(null);

  if (!authUser) return null;

  /* ======================
     HELPERS
  ====================== */

  const getFontSize = () => {
    switch (fontSize) {
      case 'small':
        return 14;
      case 'large':
        return 22;
      default:
        return 18;
    }
  };

  const showError = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorVisible(true);
  };

  const showSuccess = (
    title: string,
    message: string,
    callback?: () => void
  ) => {
    setSuccessTitle(title);
    setSuccessMessage(message);
    setOnSuccessClose(() => callback || null);
    setSuccessVisible(true);
  };

  const storedPassword = storage.getString(PASSWORD_KEY);

  /* ======================
     CHANGE USERNAME (FIXED)
  ====================== */

  const handleChangeName = async () => {
    const trimmed = newName.trim();

    if (!trimmed) {
      showError('Invalid name', 'Name cannot be empty.');
      return;
    }

    if (trimmed.length < 2) {
      showError('Name too short', 'Name must be at least 2 characters.');
      return;
    }

    if (trimmed === authUser.name) {
      showError('No changes', 'This is already your current name.');
      return;
    }

    const result = await updateUser({ name: trimmed });

    if (!result.success) {
      showError('Update failed', result.error || 'Unable to update name.');
      return;
    }

    setNewName('');
    setChangeNameVisible(false);

    showSuccess('Name updated', 'Your name has been updated successfully.');
  };

  /* ======================
     CHANGE PASSWORD
  ====================== */

  const handleChangePassword = () => {
    if (!currentPw || !newPw) {
      showError('Missing fields', 'All fields are required');
      return;
    }

    if (storedPassword !== currentPw) {
      showError('Incorrect password', 'Current password is incorrect');
      return;
    }

    if (newPw.length < 6) {
      showError('Weak password', 'Password must be at least 6 characters');
      return;
    }

    storage.set(PASSWORD_KEY, newPw);

    setCurrentPw('');
    setNewPw('');
    setChangePwVisible(false);

    showSuccess(
      'Password updated',
      'Your password has been changed successfully.'
    );
  };

  /* ======================
     EXPORT / IMPORT
  ====================== */

  const handleExport = async () => {
    if (Platform.OS === 'web') {
      showError('Not supported', 'Export is only available on mobile');
      return;
    }

    try {
      const FileSystem = await import('expo-file-system');
      const Sharing = await import('expo-sharing');

      const json = exportAppData();
      const fileUri =
        FileSystem.documentDirectory +
        `finance-backup-${Date.now()}.json`;

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);

      showSuccess(
        'Export complete',
        'Your data has been exported successfully.'
      );
    } catch (e: any) {
      showError('Export failed', e.message);
    }
  };

  const handleImport = async () => {
    if (Platform.OS === 'web') {
      showError('Not supported', 'Import is only available on mobile');
      return;
    }

    try {
      const DocumentPicker = await import('expo-document-picker');
      const FileSystem = await import('expo-file-system');

      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets?.length) return;

      const content = await FileSystem.readAsStringAsync(res.assets[0].uri);

      importAppData(content);

      showSuccess(
        'Import successful',
        'Your data has been restored. The app will restart.',
        () => {
          logout();
          router.replace('/');
        }
      );
    } catch (e: any) {
      showError('Import failed', e.message);
    }
  };

  /* ======================
     CLEAR ALL DATA
  ====================== */

  const handleClearAllData = () => {
    if (deletePhrase !== DELETE_PHRASE) {
      showError(
        'Confirmation required',
        'You must type the exact confirmation phrase.'
      );
      return;
    }

    if (!confirmPw) {
      showError('Password required', 'Please enter your password.');
      return;
    }

    if (storedPassword !== confirmPw) {
      showError('Incorrect password', 'The password you entered is wrong.');
      return;
    }

    clearAllData();
    logoutUser();

    setConfirmVisible(false);
    setConfirmPw('');
    setDeletePhrase('');

    showSuccess(
      'Account deleted',
      'All data and your account have been permanently deleted.',
      () => {
        logout();
        router.replace('/');
      }
    );
  };

  /* ======================
     LOGOUT
  ====================== */

  const handleLogout = () => {
    logoutUser();
    logout();
    router.replace('/');
  };

  /* ======================
     UI
  ====================== */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeWrapper scroll>
        {/* HEADER */}
        <View style={styles.forestHeaderContainer}>
          <Image
            source={require('../assets/forest-bg.jpg')}
            style={styles.forestImage}
          />

          <View style={styles.forestHeader}>
            <View
              style={[
                styles.largeProfileImageContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.largeProfileImageText,
                  { color: colors.text },
                ]}
              >
                {authUser.name.charAt(0)}
              </Text>
            </View>

            <Text style={[styles.userName, { fontSize: getFontSize() }]}>
              {authUser.name}
            </Text>
          </View>
        </View>

        {/* MAIN SETTINGS */}
        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.optionRow} onPress={toggleDarkMode}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Dark Theme
            </Text>
            <View style={styles.toggleSwitch}>
              <View
                style={[
                  styles.toggleKnob,
                  isDarkMode && { alignSelf: 'flex-end' },
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() =>
              router.push('/components/transactions')
            }
          >
            <Text
              style={[
                styles.optionLabel,
                { color: colors.text },
              ]}
            >
              Transaction History
            </Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/components/faq')}
          >
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Help & FAQ
            </Text>
            <Icon name="chevron-forward" size={18} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/components/about')}
          >
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              About
            </Text>
            <Icon name="chevron-forward" size={18} color={colors.icon} />
          </TouchableOpacity>


          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Settings
          </Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setChangeNameVisible(true)}
          >
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Change Username
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setChangePwVisible(true)}
          >
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Change Password
            </Text>
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <>
              <TouchableOpacity style={styles.optionRow} onPress={handleExport}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  Export Data
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleImport}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  Import Data
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* DANGER ZONE */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>

            <Text style={styles.dangerZoneDescription}>
              This will permanently delete:
              {'\n'}• Your account
              {'\n'}• All transactions
              {'\n'}• All saved data
              {'\n\n'}This action cannot be undone.
            </Text>

            <TouchableOpacity
              style={styles.dangerZoneButton}
              onPress={() => setConfirmVisible(true)}
            >
              <Text style={styles.dangerZoneButtonText}>
                Delete account & data
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ThemeWrapper>

      <BottomNavbar />

      {/* CHANGE NAME MODAL */}
      <Modal transparent visible={changeNameVisible}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Change Username
            </Text>

            <TextInput
              placeholder="New username"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text }]}
              value={newName}
              onChangeText={setNewName}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleChangeName}
            >
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setChangeNameVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL (FIXED) */}
      <Modal transparent visible={changePwVisible}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Change Password
            </Text>

            <TextInput
              secureTextEntry
              placeholder="Current password"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text }]}
              value={currentPw}
              onChangeText={setCurrentPw}
            />

            <TextInput
              secureTextEntry
              placeholder="New password"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text }]}
              value={newPw}
              onChangeText={setNewPw}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setChangePwVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Delete Everything
            </Text>

            <Text style={{ color: colors.text, marginBottom: 12 }}>
              Type{' '}
              <Text style={{ fontWeight: '800' }}>{DELETE_PHRASE}</Text> to
              confirm.
            </Text>

            <TextInput
              placeholder={DELETE_PHRASE}
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text }]}
              value={deletePhrase}
              onChangeText={setDeletePhrase}
            />

            <TextInput
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text }]}
              value={confirmPw}
              onChangeText={setConfirmPw}
            />

            <TouchableOpacity
              disabled={deletePhrase !== DELETE_PHRASE}
              style={[
                styles.dangerZoneButton,
                deletePhrase !== DELETE_PHRASE && { opacity: 0.4 },
              ]}
              onPress={handleClearAllData}
            >
              <Text style={styles.dangerZoneButtonText}>
                Permanently delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ERROR MODAL */}
      <Modal transparent visible={errorVisible} animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {errorTitle}
            </Text>

            <Text
              style={{
                color: colors.text,
                textAlign: 'center',
                marginVertical: 12,
              }}
            >
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setErrorVisible(false)}
            >
              <Text style={styles.primaryText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={successVisible} animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {successTitle}
            </Text>

            <Text
              style={{
                color: colors.text,
                textAlign: 'center',
                marginVertical: 12,
              }}
            >
              {successMessage}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setSuccessVisible(false);
                onSuccessClose?.();
              }}
            >
              <Text style={styles.primaryText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default Profile;
