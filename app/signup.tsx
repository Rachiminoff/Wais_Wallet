import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from './context/AuthContext';
import { styles } from './styles/LoginScreenStyles';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const { signup, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Clear error message when user starts typing (but not when showing success)
    if (error && !success) {
      clearError();
    }
  }, [name, email, password, confirmPassword]);

  // Clear form after successful signup with delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setValidationErrors({});
      }, 100);

      // Auto-hide success message after 5 seconds
      const hideTimer = setTimeout(() => {
        setSuccess(false);
        setSuccessMessage('');
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [success]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Username is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Username must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email, password, name);
      
      if (result.success) {
        setSuccessMessage(`Account created successfully! Please log in with your credentials.`);
        setSuccess(true);
      } else {
        // Check if error is about email already existing
        if (result.error?.includes('Email already registered') || result.error?.includes('EMAIL_ALREADY_EXISTS')) {
          setValidationErrors({ email: 'This email is already registered. Please use a different email or log in.' });
        } else {
          Alert.alert('Signup Failed', result.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (err) {
      const errorMessage = (err && typeof err === 'object' && 'message' in err) ? String(err.message) : 'An unexpected error occurred';
      
      // Check if error is about duplicate email
      if (errorMessage.includes('Email already registered') || errorMessage.includes('EMAIL_ALREADY_EXISTS')) {
        setValidationErrors({ email: 'This email is already registered. Please use a different email or log in.' });
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
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
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Text style={styles.title}>Join Us!</Text>
        <Text style={styles.subtitle}>Hey, enter your details to create your account</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Sign Up Account</Text>
        
        {/* Success Message */}
        {success && (
          <Text style={{ color: '#4CAF50', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
            Account created successfully!
          </Text>
        )}
        
        <TextInput
          style={[styles.input, validationErrors.name && { borderColor: '#ff6b6b', borderWidth: 1 }]}
          placeholder="Username"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          autoComplete="username"
        />
        {validationErrors.name && (
          <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: -8, marginBottom: 8 }}>
            {validationErrors.name}
          </Text>
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

        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, validationErrors.confirmPassword && { borderColor: '#ff6b6b', borderWidth: 1 }]}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="password"
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 15, top: 15 }}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={!confirmPassword}
          >
            <Icon
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color={confirmPassword ? '#528d94' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
        {validationErrors.confirmPassword && (
          <Text style={{ color: '#ff6b6b', fontSize: 12, marginTop: -8, marginBottom: 8 }}>
            {validationErrors.confirmPassword}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.text}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
