import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</Text>
      {message && (
        <Text className="text-gray-600 text-center">{message}</Text>
      )}
    </View>
  );
}


