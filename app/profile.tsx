import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { createMMKV } from 'react-native-mmkv';

import { BottomNavbar } from './components/BottomNavbar'; // ✅ REUSABLE NAVBAR
import { ThemeWrapper } from './components/ThemeWrapper';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import styles from './styles/profileStyles';

import {
  exportAppData,
  importAppData
} from './utils/mmkvStorage';

/* ======================
   STORAGE
====================== */

const storage = createMMKV();
const PASSWORD_KEY = 'user_password';

/* ======================
   PROFILE SCREEN
====================== */

const Profile: React.FC = () => {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const {
    isDarkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    colors,
  } = useTheme();

  /* ======================
     STATE
  ====================== */

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [changePwVisible, setChangePwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

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

  const getStoredPassword = () =>
    storage.getString(PASSWORD_KEY);

  const verifyPassword = (pw: string) =>
    getStoredPassword() === pw;

  /* ======================
     EXPORT DATA
  ====================== */

  const handleExport = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not supported',
        'Export is only available on mobile devices.'
      );
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

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Exported', fileUri);
      }
    } catch (e: any) {
      Alert.alert('Export failed', e.message);
    }
  };

  /* ======================
     IMPORT DATA
  ====================== */

  const handleImport = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not supported',
        'Import is only available on mobile devices.'
      );
      return;
    }

    try {
      const DocumentPicker = await import(
        'expo-document-picker'
      );
      const FileSystem = await import(
        'expo-file-system'
      );

      const res =
        await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true,
        });

      if (res.canceled || !res.assets?.length) return;

      const content =
        await FileSystem.readAsStringAsync(
          res.assets[0].uri
        );

      importAppData(content);

      Alert.alert(
        'Import successful',
        'App will restart',
        [
          {
            text: 'OK',
            onPress: () => {
              logout();
              router.replace('/');
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Import failed', e.message);
    }
  };

  /* ======================
     LOGOUT
  ====================== */

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  /* ======================
     DESTRUCTIVE ACTION
  ====================== */

  const destructiveAction = (action: () => void) => {
    if (!verifyPassword(confirmPw)) {
      Alert.alert('Incorrect password');
      return;
    }

    action();
    setConfirmPw('');
    setConfirmVisible(false);
  };

  /* ======================
     UI
  ====================== */

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ThemeWrapper scroll>
        {/* ======================
            HEADER
        ====================== */}

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

            <Text
              style={[
                styles.userName,
                { fontSize: getFontSize() },
              ]}
            >
              {authUser.name}
            </Text>
          </View>
        </View>

        {/* ======================
            PROFILE SETTINGS
        ====================== */}

        <View
          style={[
            styles.profileSection,
            { backgroundColor: colors.card },
          ]}
        >
          {/* DARK MODE */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={toggleDarkMode}
          >
            <Text
              style={[
                styles.optionLabel,
                { color: colors.text },
              ]}
            >
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

          {/* FONT SIZE */}
          <View style={styles.optionRowSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.subtleText },
              ]}
            >
              Font size
            </Text>

            {(['small', 'medium', 'large'] as const).map(
              size => (
                <TouchableOpacity
                  key={size}
                  style={styles.radioOption}
                  onPress={() => setFontSize(size)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      fontSize === size &&
                        styles.radioCircleSelected,
                    ]}
                  />
                  <Text style={{ color: colors.text }}>
                    {size}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ACCOUNT SETTINGS */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSettingsVisible(true)}
          >
            <Text
              style={[
                styles.optionLabel,
                { color: colors.text },
              ]}
            >
              Account Settings
            </Text>
            <Icon
              name="settings-outline"
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>

          {/* TRANSACTIONS */}
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

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon
              name="log-out-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.logoutButtonText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ThemeWrapper>

      {/* ======================
          ✅ REUSABLE NAVBAR
      ====================== */}

      <BottomNavbar />

      {/* ======================
          MODALS (UNCHANGED)
      ====================== */}

      {/* ACCOUNT SETTINGS */}
<Modal transparent visible={settingsVisible}>
  <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        Account Settings
      </Text>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => {
          setSettingsVisible(false);
          setChangePwVisible(true);
        }}
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

      <TouchableOpacity style={styles.dangerButton}>
        <Text style={[styles.dangerText, { color: colors.dangerText }]}>
          Clear ALL Data
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalCancel}>
        <Text style={[styles.modalCancelText, { color: colors.text }]}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* CHANGE PASSWORD */}
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
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={currentPw}
        onChangeText={setCurrentPw}
      />

      <TextInput
        secureTextEntry
        placeholder="New password"
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={newPw}
        onChangeText={setNewPw}
      />

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={[styles.primaryText, { color: colors.primaryText }]}>
          Save
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalCancel}>
        <Text style={[styles.modalCancelText, { color: colors.text }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* CONFIRM WIPE */}
<Modal transparent visible={confirmVisible}>
  <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        Confirm Data Wipe
      </Text>

      <TextInput
        secureTextEntry
        placeholder="Enter password"
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={confirmPw}
        onChangeText={setConfirmPw}
      />

      <TouchableOpacity style={styles.dangerButton}>
        <Text style={[styles.dangerText, { color: colors.dangerText }]}>
          Delete Everything
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.modalCancel}>
        <Text style={[styles.modalCancelText, { color: colors.text }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

export default Profile;
