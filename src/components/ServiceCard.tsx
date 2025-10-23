import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface ServiceCardProps {
  title: string;
  price: number;
  duration: number;
  icon: string;
  description?: string;
  onPress: () => void;
}

export default function ServiceCard({
  title,
  price,
  duration,
  icon,
  description,
  onPress,
}: ServiceCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceSecondary,
            borderWidth: 1,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon name={icon} size={28} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description && (
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {description}
        </Text>
      )}
      <Text style={[styles.duration, { color: colors.textTertiary }]}>
        {duration} minutes
      </Text>

      <Text style={[styles.price, { color: colors.primary }]}>
        ₹{price.toLocaleString()}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary, borderRadius: 9999 },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { color: colors.textInverse }]}>
          Book Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    width: '48%',
    marginBottom: 16,
    minHeight: 240,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  duration: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
