import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from './context/AuthContext';
import { styles } from './styles/WelcomeScreenStyles';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading before navigating
    if (loading) {
      return;
    }

    // If user is already logged in, redirect to home
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, loading]);

  return (
    <ImageBackground 
      source={require('../assets/forest-bg.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Wais Wallet</Text>
          <Image 
            source={require('../assets/logo.png')}
            style={styles.boxIcon}
          />
        </View>

        <View style={styles.bottomBox}>
          <View>
            <Text style={styles.boxWelcomeText}>Welcome</Text>
            <Text style={styles.boxDescriptionText}>
              Take control of your finances with Wais Pocket! Organize your income into custom pockets. 
            </Text>
          </View>

          <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupButton}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        </View>
      </View>
    </ImageBackground>
  );
}
