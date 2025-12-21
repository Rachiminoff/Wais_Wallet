import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from './context/AuthContext';
import { styles } from './styles/ProfileScreenStyles';

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
            logout();
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

  const navigateToExpense = (): void => {
    router.push('./expense');
  };

  const navigateToBudget = (): void => {
    router.push('./budget');
  };

  const navigateToSavings = (): void => {
    router.push('./savings');
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
          onPress={navigateToExpense}
        >
        <View style={styles.navIconContainer}>
            <Icon name="wallet-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToBudget}
        >
          <View style={styles.navIconContainer}>
            <Icon name="clipboard-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToBudget}
        >
          <View style={styles.navIconContainer}>
            <Icon name="trophy-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Savings</Text>
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

export default Profile;
