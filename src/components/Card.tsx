import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  title?: string;
  onPress?: () => void;
}

export default function Card({ children, title, onPress }: CardProps) {
  const { colors } = useTheme();
  const Container = onPress ? TouchableOpacity : View;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 8,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      padding: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
  });

  return (
    <Container onPress={onPress} style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </Container>
  );
}
