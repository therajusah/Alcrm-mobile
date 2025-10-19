import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={28} color="#FFF" />
      </View>

      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}
      <Text style={styles.duration}>{duration} minutes</Text>

      <Text style={styles.price}>₹{price.toLocaleString()}</Text>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Book Now</Text>
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
    backgroundColor: '#388E3C',
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
    color: '#388E3C',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
