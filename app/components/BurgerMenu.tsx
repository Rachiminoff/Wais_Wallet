import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationPress: () => void;
  onSettingsPress: () => void;
  onProfilePress?: () => void;
  onHelpPress?: () => void;
  onLogoutPress?: () => void;
}

const { width, height } = Dimensions.get('window');

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  onNotificationPress,
  onSettingsPress,
  onProfilePress = () => console.log('Profile pressed'),
  onHelpPress = () => console.log('Help pressed'),
  onLogoutPress = () => console.log('Logout pressed'),
}) => {
  const menuItems: { id: number; icon: string; label: string; onPress: () => void }[] = [
    { id: 2, icon: 'settings-outline', label: 'Settings', onPress: onSettingsPress },
    { id: 4, icon: 'help-circle-outline', label: 'Help & Support', onPress: onHelpPress },
    { id: 5, icon: 'exit-outline', label: 'Logout', onPress: onLogoutPress },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.menuContainer}>
          <SafeAreaView style={styles.menuContent}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>WAIS WALLET</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress(); // call the function safely
                    onClose();     // close menu
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.icon as any} size={24} color="#1a374a" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* App Version */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  menuContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  menuContent: { flex: 1 },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuTitle: { fontSize: 20, fontWeight: '800', color: '#1a374a', letterSpacing: 0.5 },
  closeButton: { padding: 8, borderRadius: 20, backgroundColor: '#F8F9FA' },
  menuItems: { paddingVertical: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  menuItemText: { fontSize: 16, color: '#1a374a', marginLeft: 16 },
  versionContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  versionText: { fontSize: 12, color: '#8E8E93' },
});

export default BurgerMenu;
