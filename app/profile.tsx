import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from './context/AuthContext';

const Profile: React.FC = () => {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const handleLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          logout();
          router.replace('/login');
        },
        style: 'destructive',
      },
    ]);
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* GRADIENT PROFILE HEADER */}
        <View style={styles.gradientProfileCard}>
          <LinearGradient
            colors={['#528d94', '#528d94']}
            style={styles.topExtension}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          
          <LinearGradient
            colors={['#528d94', '#3a6d73']}
            style={styles.gradientProfileCardInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Profile Icon */}
            <View style={styles.profileIconContainer}>
              <Icon name="person" size={64} color="rgba(255, 255, 255, 0.9)" />
            </View>
            
            {/* User Info */}
            <Text style={styles.profileName}>{authUser.name.toUpperCase()}</Text>
            <Text style={styles.profileEmail}>{authUser.email.toLowerCase()}</Text>
          </LinearGradient>
        </View>

        {/* PROFILE OPTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.optionsList}>
            <View style={styles.optionRow}>
              <Icon name="person-outline" size={22} color="#528d94" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Name</Text>
                <Text style={styles.optionValue}>{authUser.name}</Text>
              </View>
            </View>

            <View style={styles.optionRow}>
              <Icon name="mail-outline" size={22} color="#528d94" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Email</Text>
                <Text style={styles.optionValue}>{authUser.email}</Text>
              </View>
            </View>

            <View style={styles.optionRow}>
              <Icon name="calendar-outline" size={22} color="#528d94" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Member Since</Text>
                <Text style={styles.optionValue}>
                  {new Date(authUser.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navItem} onPress={navigateToHome}>
          <View style={styles.navIconContainer}>
            <Icon name="home-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToBudget}>
          <View style={styles.navIconContainer}>
            <Icon name="pie-chart-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToCards}>
          <View style={styles.navIconContainer}>
            <Icon name="card-outline" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  
  // Gradient Profile Card
  gradientProfileCard: {
    marginBottom: 30,
    overflow: 'hidden',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientProfileCardInner: {
    padding: 40,
    alignItems: 'center',
  },
  topExtension: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#528d94',
  },
  profileIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    marginBottom: 4,
  },
  navItemText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  navItemTextActive: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Profile;
