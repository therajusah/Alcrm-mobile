import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.buttonPrimary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.buttonSecondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.buttonPrimary,
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return colors.primary;
    }
    if (variant === 'secondary') {
      return colors.buttonTextSecondary;
    }
    return colors.buttonText;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 };
      case 'md':
        return { fontSize: 16 };
      case 'lg':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const isDisabled = disabled || loading;

  const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isDisabled ? 0.5 : 1,
      ...getVariantStyles(),
      ...getSizeStyles(),
    },
    text: {
      color: getTextColor(),
      fontWeight: '600',
      textAlign: 'center',
      ...getTextSizeStyles(),
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={styles.button}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
