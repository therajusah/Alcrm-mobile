import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    iconContainer: {
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      color: colors.textSecondary,
      textAlign: 'center',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
