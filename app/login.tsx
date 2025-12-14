import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from './context/AuthContext';
import { styles } from './styles/LoginScreenStyles';
import { clearAllStorage } from './utils/mmkvStorage';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if coming from successful signup
  useEffect(() => {
    // Check URL params for accountCreated flag
    const params = new URLSearchParams(window?.location?.search || '');
    if (params.get('accountCreated') === 'true') {
      setShowSuccessMessage(true);
    }
  }, []);

  useEffect(() => {
    // Clear validation errors when user starts typing
    if (validationErrors.email || validationErrors.password) {
      clearError();
    }
  }, [email, password]);

  // Hide success message after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const result = await login(email.toLowerCase().trim(), password);

      if (result.success) {
        // Reset form on successful login
        setEmail('');
        setPassword('');
        setValidationErrors({});
        setServerError(null);
        router.replace('/home');
      } else {
        const errorMessage = result.error || 'Account doesn\'t exist or password is incorrect';
        setServerError(errorMessage);
        Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setServerError(errorMessage);
      Alert.alert('Error', errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Clear All Data\n\nThis will delete all accounts and data. Are you sure?');
      if (!confirmed) return;
      
      try {
        clearAllStorage();
        setEmail('');
        setPassword('');
        setValidationErrors({});
        setServerError(null);
        window.alert('All data cleared successfully!');
      } catch (err) {
        window.alert('Failed to clear storage');
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'This will delete all accounts and data. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              try {
                clearAllStorage();
                setEmail('');
                setPassword('');
                setValidationErrors({});
                setServerError(null);
                Alert.alert('Success', 'All data cleared successfully!');
              } catch (err) {
                Alert.alert('Error', 'Failed to clear storage');
              }
            },
          },
        ]
      );
    }
  };

  const handleNavigateToSignup = () => {
    try {
      // Reset login state before navigating
      setEmail('');
      setPassword('');
      setValidationErrors({});
      setServerError(null);
      clearError();
      router.push('/signup');
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to signup');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/forest-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { backgroundColor: 'transparent' }]}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Hey, enter your details to log in to your account
            </Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>Log In Account</Text>

              {/* Success Message */}
              {showSuccessMessage && (
                <Text style={{ color: '#4CAF50', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
                  Account created successfully! Please log in.
                </Text>
              )}

              {/* Server Error Alert */}
              {serverError && (
                <View style={{
                  backgroundColor: '#ffebee',
                  borderLeftWidth: 4,
                  borderLeftColor: '#f44336',
                  padding: 12,
                  marginBottom: 16,
                  borderRadius: 4,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="alert-circle" size={20} color="#f44336" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#c62828', flex: 1, fontSize: 13 }}>
                      {serverError}
                    </Text>
                    <TouchableOpacity onPress={() => setServerError(null)}>
                      <Icon name="close" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TextInput
                style={[styles.input, validationErrors.email && { borderColor: '#ff6b6b', borderWidth: 1 }]}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                accessibilityLabel="Email input"
              />
              {validationErrors.email && (
                <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                  {validationErrors.email}
                </Text>
              )}

              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, validationErrors.password && { borderColor: '#ff6b6b', borderWidth: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                  accessibilityLabel="Password input"
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={!password}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={password ? '#528d94' : '#ccc'}
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.password && (
                <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                  {validationErrors.password}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.formContainer}>
                <Text style={styles.text}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleNavigateToSignup} disabled={loading}>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Debug: Clear Storage Button */}
              <TouchableOpacity 
                onPress={handleClearStorage}
                style={{ marginTop: 20, alignItems: 'center' }}
              >
                <Text style={{ color: '#ff6b6b', fontSize: 12, textDecorationLine: 'underline' }}>
                  Clear All Data (Testing)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
