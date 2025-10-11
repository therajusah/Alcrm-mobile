import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login, isLoading, clearError } = useAuthStore();
  const { colors } = useTheme();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Attempting login with:', { email, password: '***' });
      await login(email, password);
      console.log('Login successful');
      // Navigation will be handled automatically by AppNavigator
    } catch (loginError) {
      console.log('Login error:', loginError);
      const errorMessage =
        loginError instanceof Error
          ? loginError.message
          : 'An error occurred during login';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 48,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      marginBottom: 24,
    },
    forgotPassword: {
      marginBottom: 24,
      alignItems: 'flex-end',
    },
    forgotPasswordText: {
      color: colors.primary,
      fontWeight: '600',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    signupText: {
      color: colors.textSecondary,
    },
    signupLink: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
