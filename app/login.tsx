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
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles/LoginScreenStyles';
import {
  AuthError,
  clearAllStorage,
  loginUser,
  setLoggedIn
} from './utils/mmkvStorage';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message if coming from signup
  useEffect(() => {
    const params = new URLSearchParams(window?.location?.search || '');
    if (params.get('accountCreated') === 'true') {
      setShowSuccessMessage(true);
    }
  }, []);

  // Clear validation errors on input change
  useEffect(() => {
    if (validationErrors.email || validationErrors.password) {
      setValidationErrors({});
    }
  }, [email, password]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);

    try {
      const user = loginUser(email.toLowerCase().trim(), password); // throws AuthError on failure
      if (user) {
        setLoggedIn(true); // mark session active
        setEmail('');
        setPassword('');
        setValidationErrors({});
        setServerError(null);

        router.replace('/home');
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setServerError(err.message);
        Alert.alert('Login Failed', err.message);
      } else {
        setServerError('An unexpected error occurred');
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    if (Platform.OS === 'web') {
      if (!window.confirm('Clear All Data\n\nThis will delete all accounts and data. Are you sure?')) return;
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
    setEmail('');
    setPassword('');
    setValidationErrors({});
    setServerError(null);
    router.push('/signup');
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
            <Text style={styles.subtitle}>Hey, enter your details to log in to your account</Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>Log In Account</Text>

              {showSuccessMessage && (
                <Text style={{ color: '#4CAF50', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
                  Account created successfully! Please log in.
                </Text>
              )}

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
                    <Text style={{ color: '#c62828', flex: 1, fontSize: 13 }}>{serverError}</Text>
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
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={!password}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={password ? '#528d94' : '#ccc'} />
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
                <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
              </TouchableOpacity>

              <View style={styles.formContainer}>
                <Text style={styles.text}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleNavigateToSignup} disabled={loading}>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </View>

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
