import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export default function Badge({ text, variant = 'default' }: BadgeProps) {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: `${colors.success}20`,
          borderColor: `${colors.success}40`,
        };
      case 'warning':
        return {
          backgroundColor: `${colors.warning}20`,
          borderColor: `${colors.warning}40`,
        };
      case 'danger':
        return {
          backgroundColor: `${colors.error}20`,
          borderColor: `${colors.error}40`,
        };
      case 'info':
        return {
          backgroundColor: `${colors.primary}20`,
          borderColor: `${colors.primary}40`,
        };
      default:
        return {
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.border,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.error;
      case 'info':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      ...getVariantStyles(),
    },
    text: {
      fontSize: 12,
      fontWeight: '600',
      color: getTextColor(),
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
