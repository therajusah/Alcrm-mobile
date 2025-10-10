import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({
  text,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 border-green-200';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200';
      case 'danger':
        return 'bg-red-100 border-red-200';
      case 'info':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'danger':
        return 'text-red-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <View
      className={`px-2 py-1 rounded-full border ${getVariantStyles()} ${className}`.trim()}
    >
      <Text className={`text-xs font-semibold ${getTextStyles()}`.trim()}>
        {text}
      </Text>
    </View>
  );
}
