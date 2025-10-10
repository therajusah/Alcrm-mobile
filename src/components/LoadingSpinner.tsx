import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({
  message,
  size = 'large',
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size={size} color="#3B82F6" />
      {message && <Text className="text-gray-600 mt-4">{message}</Text>}
    </View>
  );
}
