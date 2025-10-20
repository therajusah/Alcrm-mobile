import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, secureTextEntry, ...props }: InputProps) {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      color: colors.text,
      fontWeight: '600',
      marginBottom: 8,
      fontSize: 16,
    },
    inputWrapper: {
      borderWidth: 1,
      borderColor: error ? colors.error : colors.inputBorder,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    input: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      fontSize: 16,
      flex: 1,
      borderWidth: 0,
    },
    eyeButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    eyeText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    error: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry={secureTextEntry ? !isPasswordVisible : undefined}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            onPress={() => setIsPasswordVisible(v => !v)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
