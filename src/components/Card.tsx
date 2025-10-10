import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  children: ReactNode;
  title?: string;
  onPress?: () => void;
  className?: string;
}

export default function Card({ children, title, onPress, className = '' }: CardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className={`bg-white rounded-lg shadow-sm p-4 mb-4 ${className}`.trim()}
    >
      {title && (
        <Text className="text-lg font-bold text-gray-900 mb-3">{title}</Text>
      )}
      {children}
    </Container>
  );
}

