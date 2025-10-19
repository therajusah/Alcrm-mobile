import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { NavigationProp } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface ChangePasswordScreenProps {
  navigation: NavigationProp;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordScreen({
  navigation,
}: ChangePasswordScreenProps) {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: PasswordErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: You'll need to add a change password endpoint to your backend
      // For now, this is a placeholder
      Alert.alert(
        'Info',
        'Password change functionality requires backend implementation. Please contact support to change your password.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to change password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    infoText: {
      color: colors.textSecondary,
      marginBottom: 24,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card>
            <Text style={styles.infoText}>
              Enter your current password and choose a new password
            </Text>

            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={text => {
                setCurrentPassword(text);
                if (errors.currentPassword)
                  setErrors({ ...errors, currentPassword: undefined });
              }}
              error={errors.currentPassword}
              secureTextEntry
              autoCapitalize="none"
            />

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
              label="Confirm New Password"
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
              title="Change Password"
              onPress={handleChangePassword}
              loading={isLoading}
            />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
