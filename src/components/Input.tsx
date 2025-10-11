import React from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  const { colors } = useTheme();

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
    input: {
      borderWidth: 1,
      borderColor: error ? colors.error : colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      backgroundColor: colors.inputBackground,
      fontSize: 16,
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
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.inputPlaceholder}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
