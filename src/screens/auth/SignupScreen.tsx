import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
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
    const newErrors: any = {};
    
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
      await authApi.requestOtp(email);
      setStep('otp');
      Alert.alert('Success', 'OTP sent to your email');
      setErrors({});
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      setPreSignupToken(response.preSignupToken);
      setStep('details');
      Alert.alert('Success', 'Email verified successfully');
      setErrors({});
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateDetails()) return;

    setIsLoading(true);
    try {
      await signup(email, password, phone);
      Alert.alert('Success', 'Account created successfully');
      // Navigation will be handled automatically
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 px-6 pt-12">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-base">
              {step === 'email' && 'Enter your email to get started'}
              {step === 'otp' && 'Verify your email'}
              {step === 'details' && 'Complete your profile'}
            </Text>
          </View>

          {/* Step 1: Email */}
          {step === 'email' && (
            <View>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
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
                onChangeText={(text) => {
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
                className="mb-3"
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
                onChangeText={(text) => {
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
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
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

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

