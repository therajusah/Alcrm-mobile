import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { NavigationProp } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';

interface SignupScreenProps {
  navigation: NavigationProp;
}

interface SignupErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { colors } = useTheme();
  const { showAlert, hideAlert, alertState } = useModernAlert();
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  const { signup, setPreSignupToken } = useAuthStore();

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email is invalid' });
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return false;
    }
    return true;
  };

  const validateDetails = () => {
    const newErrors: SignupErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      console.log('SignupScreen: Requesting OTP for email:', email);
      await authApi.requestOtp(email);
      setStep('otp');
      showAlert('Success', 'OTP sent to your email', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      setErrors({});
      console.log('SignupScreen: OTP request successful, moved to OTP step');
    } catch (err: unknown) {
      console.log('SignupScreen: OTP request error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send OTP';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    try {
      console.log('SignupScreen: Verifying OTP for email:', email, 'OTP:', otp);
      const response = await authApi.verifyOtp(email, otp);
      console.log('SignupScreen: OTP verification response:', response);
      setPreSignupToken(response.preSignupToken);
      setStep('details');
      showAlert('Success', 'Email verified successfully', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      setErrors({});
      console.log(
        'SignupScreen: OTP verification successful, moved to details step'
      );
    } catch (err: unknown) {
      console.log('SignupScreen: OTP verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateDetails()) return;

    setIsLoading(true);
    try {
      console.log('SignupScreen: Starting signup process with:', {
        email,
        phone,
      });
      await signup(email, password, phone);
      showAlert('Success', 'Account created successfully', [
        {
          text: 'OK',
          onPress: () => {
            hideAlert();
            navigation.navigate('Onboarding');
          },
        },
      ]);
      console.log('SignupScreen: Signup completed successfully');
      // Navigate to onboarding instead of main app
    } catch (err: unknown) {
      console.log('SignupScreen: Signup error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create account';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    } finally {
      setIsLoading(false);
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
      marginBottom: 40,
    },
    logoImage: {
      width: 120,
      height: 120,
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
      marginBottom: 24,
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
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    stepDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepActive: {
      backgroundColor: colors.primary,
    },
    stepCompleted: {
      backgroundColor: colors.success,
    },
    stepInactive: {
      backgroundColor: colors.border,
    },
    stepNumber: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: colors.border,
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
    signInLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    signInButton: {
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
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {step === 'email' && 'Enter your email to get started'}
            {step === 'otp' && 'Verify your email with OTP'}
            {step === 'details' && 'Complete your profile to continue'}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View
            style={[
              styles.stepDot,
              step === 'email' ? styles.stepActive : styles.stepCompleted,
            ]}
          >
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View
            style={[
              styles.stepDot,
              step === 'otp'
                ? styles.stepActive
                : step === 'details'
                  ? styles.stepCompleted
                  : styles.stepInactive,
            ]}
          >
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View
            style={[
              styles.stepDot,
              step === 'details' ? styles.stepActive : styles.stepInactive,
            ]}
          >
            <Text style={styles.stepNumber}>3</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Step 1: Email */}
          {step === 'email' && (
            <View>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setErrors({});
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                title="Send OTP"
                onPress={handleRequestOtp}
                loading={isLoading}
              />
            </View>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <View>
              <Input
                label="OTP Code"
                placeholder="Enter 6-digit code"
                value={otp}
                onChangeText={text => {
                  setOtp(text);
                  setErrors({});
                }}
                error={errors.otp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <Button
                title="Verify OTP"
                onPress={handleVerifyOtp}
                loading={isLoading}
              />

              <Button
                title="Resend OTP"
                onPress={handleRequestOtp}
                variant="outline"
                disabled={isLoading}
              />
            </View>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <View>
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                error={errors.phone}
                keyboardType="phone-pad"
              />

              <Input
                label="Password"
                placeholder="Create a password"
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

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                error={errors.confirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Button
                title="Create Account"
                onPress={handleSignup}
                loading={isLoading}
              />
            </View>
          )}
        </View>

        {/* Sign In Link */}
        <View style={styles.signInLink}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInButton}>Sign In</Text>
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
