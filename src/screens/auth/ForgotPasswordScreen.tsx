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
import { authApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { NavigationProp } from '../../types';

interface ForgotPasswordScreenProps {
  navigation: NavigationProp;
}

interface PasswordErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ForgotPasswordScreen({
  navigation,
}: ForgotPasswordScreenProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});

  const handleRequestOtp = async () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setStep('otp');
      Alert.alert('Success', 'OTP sent to your email');
      setErrors({});
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyPasswordResetOtp(email, otp);
      setResetToken(response.resetToken);
      setStep('password');
      Alert.alert('Success', 'OTP verified successfully');
      setErrors({});
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const newErrors: PasswordErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(email, newPassword, resetToken);
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reset password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {step === 'email' && 'Enter your email to receive OTP'}
            {step === 'otp' && 'Verify the OTP sent to your email'}
            {step === 'password' && 'Create your new secure password'}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 'email' ? styles.stepActive : styles.stepCompleted]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === 'otp' ? styles.stepActive : step === 'password' ? styles.stepCompleted : styles.stepInactive]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === 'password' ? styles.stepActive : styles.stepInactive]}>
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

          {/* Step 3: New Password */}
          {step === 'password' && (
            <View>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text);
                  if (errors.newPassword)
                    setErrors({ ...errors, newPassword: undefined });
                }}
                error={errors.newPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
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
                title="Reset Password"
                onPress={handleResetPassword}
                loading={isLoading}
              />
            </View>
          )}

        </View>

        {/* Back to Login */}
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: -1,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
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
    backgroundColor: '#2563EB',
  },
  stepCompleted: {
    backgroundColor: '#10B981',
  },
  stepInactive: {
    backgroundColor: '#D1D5DB',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
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
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 15,
  },
});
