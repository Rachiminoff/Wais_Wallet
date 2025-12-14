import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from './context/AuthContext';

const Profile: React.FC = () => {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    console.log('Logout button pressed');
    
    // Use native confirm for web, Alert for mobile
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) {
        console.log('Logout cancelled');
        return;
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', onPress: () => { console.log('Logout cancelled'); }, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            console.log('Logging out...');
            logout();
            console.log('Navigating to welcome screen...');
            router.replace('/');
          },
          style: 'destructive',
        },
      ]);
      return;
    }
    
    try {
      console.log('Logging out...');
      logout();
      console.log('Navigating to welcome screen...');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigate to other pages
  const navigateToHome = (): void => {
    router.push('/home');
  };

  const navigateToBudget = (): void => {
    router.push('/budget');
  };

  const navigateToCards = (): void => {
    router.push('/cards');
  };

  const navigateToProfile = (): void => {
    router.push('/profile');
  };

  if (!authUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* FOREST HEADER SECTION */}
        <View style={styles.forestHeaderContainer}>
          <Image source={require('../assets/forest-bg.jpg')} style={styles.forestImage} />
          
          {/* PROFILE HEADER IN FOREST */}
          <View style={styles.forestHeader}>
            <View style={styles.largeProfileImageContainer}>
              <Text style={styles.largeProfileImageText}>{authUser.name?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.userNameSection}>
              <Text style={styles.userName}>{authUser.name || 'User'}</Text>
              <Icon name="create-outline" size={20} color="#fff" style={styles.editIcon} />
            </View>
          </View>
        </View>

          {/* PROFILE CONTENT SECTION */}
          <View style={styles.profileSection}>
            {/* Dark Theme */}
            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>Dark Theme</Text>
              </View>
              <View style={styles.toggleSwitch}>
                <View style={styles.toggleSwitchInactive} />
              </View>
            </View>

            {/* Font Size */}
            <View style={styles.optionRowSection}>
              <Text style={styles.sectionTitle}>Font size</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <View style={styles.radioCircle} />
                  <Text style={styles.radioLabel}>Small</Text>
                </View>
                <View style={styles.radioOption}>
                  <View style={[styles.radioCircle, styles.radioCircleSelected]}>
                    <View style={styles.radioCircleDot} />
                  </View>
                  <Text style={styles.radioLabel}>Medium</Text>
                </View>
                <View style={styles.radioOption}>
                  <View style={styles.radioCircle} />
                  <Text style={styles.radioLabel}>Large</Text>
                </View>
              </View>
            </View>

            {/* Change Password */}
            <TouchableOpacity style={styles.optionRow}>
              <Text style={styles.optionLabel}>Change Password</Text>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTTOM NAVBAR */}
        <View style={styles.bottomNavbar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToHome}
        >
          <View style={styles.navIconContainer}>
            <Icon name="home-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToBudget}
        >
          <View style={styles.navIconContainer}>
            <Icon name="pie-chart-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToCards}
        >
          <View style={styles.navIconContainer}>
            <Icon name="card-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToProfile}
        >
          <View style={styles.navIconContainer}>
            <Icon name="person" size={22} color="#007AFF" />
          </View>
          <Text style={styles.navItemTextActive}>Profile</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },
  safeAreaContent: {
    flex: 1,
  },
  forestBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    style: { width: 100, height: 200 },
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  forestHeaderContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
  },
  forestImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  forestHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a3a3a',
  },
  largeProfileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  largeProfileImageText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },
  userNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  userName: {
    fontSize: 25,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  editIcon: {
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Profile Name
  profileName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },

  // Profile Section - 2/3 of page
  profileSection: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },

  optionRowSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#000',
  },
  radioCircleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    alignSelf: 'center',
    marginTop: 4,
  },
  radioLabel: {
    fontSize: 14,
    color: '#000',
  },

  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImageText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileUsername: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },

  // Options Section
  optionsSection: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  optionValue: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },

  // Toggle Switch
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3a3a',
    marginBottom: 16,
  },
  
  // Options List
  optionsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a3a',
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#DC3545',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },

  // Bottom Navbar
  bottomNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navItemText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  navItemTextActive: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default Profile;
