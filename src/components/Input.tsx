import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  containerClassName = '',
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`.trim()}>
      {label && (
        <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
      )}
      <TextInput
        className={`
          border
          ${error ? 'border-red-500' : 'border-gray-300'}
          rounded-lg
          px-4
          py-3
          text-gray-900
          bg-white
        `.trim()}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
