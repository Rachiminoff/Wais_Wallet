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
import { isLoggedIn, loginUser } from './utils/mmkvStorage';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  /* =====================
     AUTO REDIRECT
  ===================== */
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/home');
    }
  }, []);

  /* =====================
     SUCCESS FROM SIGNUP
  ===================== */
  useEffect(() => {
    if (Platform.OS === 'web') {
      const params = new URLSearchParams(
        window?.location?.search || ''
      );
      if (params.get('accountCreated') === 'true') {
        setShowSuccessMessage(true);
      }
    }
  }, []);

  /* =====================
     CLEAR ERRORS ON TYPE
  ===================== */
  useEffect(() => {
    if (validationErrors.email || validationErrors.password) {
      setValidationErrors({});
    }
  }, [email, password]);

  /* =====================
     VALIDATION
  ===================== */
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* =====================
     LOGIN
  ===================== */
  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);

    try {
      loginUser(email.toLowerCase().trim(), password);

      setEmail('');
      setPassword('');
      setValidationErrors({});
      setServerError(null);

      router.replace('/home');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed';

      setServerError(message);
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     NAVIGATION
  ===================== */
  const handleNavigateToSignup = () => {
    setEmail('');
    setPassword('');
    setValidationErrors({});
    setServerError(null);
    router.push('/signup');
  };

  /* =====================
     RENDER
  ===================== */
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
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.container,
              { backgroundColor: 'transparent' },
            ]}
          >
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Hey, enter your details to log in to your account
            </Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>
                Log In Account
              </Text>

              {showSuccessMessage && (
                <Text
                  style={{
                    color: '#4CAF50',
                    fontSize: 13,
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  Account created successfully! Please log in.
                </Text>
              )}

              {serverError && (
                <View
                  style={{
                    backgroundColor: '#ffebee',
                    borderLeftWidth: 4,
                    borderLeftColor: '#f44336',
                    padding: 12,
                    marginBottom: 16,
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name="alert-circle"
                      size={20}
                      color="#f44336"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color: '#c62828',
                        flex: 1,
                        fontSize: 13,
                      }}
                    >
                      {serverError}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setServerError(null)}
                    >
                      <Icon
                        name="close"
                        size={20}
                        color="#f44336"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TextInput
                style={[
                  styles.input,
                  validationErrors.email && {
                    borderColor: '#ff6b6b',
                    borderWidth: 1,
                  },
                ]}
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
                <Text
                  style={{
                    color: '#ff6b6b',
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  {validationErrors.email}
                </Text>
              )}

              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.password && {
                      borderColor: '#ff6b6b',
                      borderWidth: 1,
                    },
                  ]}
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
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: 15,
                  }}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={!password}
                >
                  <Icon
                    name={
                      showPassword ? 'eye-off' : 'eye'
                    }
                    size={20}
                    color={
                      password ? '#528d94' : '#ccc'
                    }
                  />
                </TouchableOpacity>
              </View>

              {validationErrors.password && (
                <Text
                  style={{
                    color: '#ff6b6b',
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  {validationErrors.password}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  loading && { opacity: 0.6 },
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading
                    ? 'Signing In...'
                    : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.formContainer}>
                <Text style={styles.text}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={handleNavigateToSignup}
                  disabled={loading}
                >
                  <Text style={styles.link}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
