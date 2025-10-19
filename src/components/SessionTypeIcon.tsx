import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SessionTypeIconProps {
  type: string;
  size?: number;
}

const getIconForType = (type: string): string => {
  const typeUpper = type.toUpperCase();
  if (typeUpper.includes('CAREER') || typeUpper.includes('GUIDANCE')) return '👥';
  if (typeUpper.includes('MOCK') || typeUpper.includes('INTERVIEW')) return '💼';
  if (typeUpper.includes('RESUME') || typeUpper.includes('CV') || typeUpper.includes('REVIEW')) return '📄';
  if (typeUpper.includes('INDUSTRY') || typeUpper.includes('INSIGHTS')) return '⭐';
  if (typeUpper.includes('SKILL') || typeUpper.includes('DEVELOPMENT') || typeUpper.includes('DOMAIN') || typeUpper.includes('COACHING')) return '✅';
  if (typeUpper.includes('BEHAVIORAL') || typeUpper.includes('PREP')) return '🗣️';
  return '📚';
};

export default function SessionTypeIcon({ type, size = 24 }: SessionTypeIconProps) {
  const icon = getIconForType(type);

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize: size }]}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});

