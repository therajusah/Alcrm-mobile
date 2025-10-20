import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';

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
  const { showAlert, hideAlert, alertState } = useModernAlert();
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

      const msg = (errorMessage || '').toLowerCase();
      const isUserMissing = /user\s*(not\s*)?found|does\s*not\s*exist|no\s*account/.test(msg);
      const isInvalidCreds = /invalid|wrong|incorrect|unauthori/.test(msg);

      if (isUserMissing) {
        showAlert('Account Not Found', 'We could not find an account for this email. Create one now?', [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          { text: 'Sign Up', onPress: () => navigation.navigate('Signup') },
        ]);
        return;
      }

      if (isInvalidCreds) {
        showAlert('Invalid Credentials', 'Email or password is incorrect. Please try again.', [
          { text: 'Try Again', onPress: () => {}, style: 'default' },
          { text: 'Forgot Password', onPress: () => navigation.navigate('ForgotPassword') },
        ]);
        return;
      }

      showAlert('Login Failed', errorMessage, [
        { text: 'Try Again', onPress: () => {}, style: 'default' },
        { text: 'Create Account', onPress: () => navigation.navigate('Signup') },
      ]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoText: {
      fontSize: 42,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: -1,
    },
    logoSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    header: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    form: {
      marginBottom: 20,
    },
    forgotPassword: {
      marginTop: 8,
      marginBottom: 24,
      alignItems: 'flex-end',
    },
    forgotPasswordText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 14,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    signupText: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    signupLink: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 15,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ALCRM</Text>
          <Text style={styles.logoSubtext}>MOBILE</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue to your account
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
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
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModernAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
  );
}
