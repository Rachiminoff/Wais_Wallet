import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles/HomeScreenStyles';

const Budget: React.FC = () => {
  const router = useRouter();

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
    router.push('./budget');
  };

  const navigateToProfile = (): void => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }} />

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
            <Icon name="clipboard-outline" size={22} color="#007AFF" />
          </View>
          <Text style={styles.navItemTextActive}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={navigateToSavings}
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
            <Icon name="person" size={22} color="#8E8E93" />
          </View>
          <Text style={styles.navItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Budget;