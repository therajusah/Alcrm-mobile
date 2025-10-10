import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600';
      case 'secondary':
        return 'bg-gray-600';
      case 'outline':
        return 'bg-transparent border-2 border-primary-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-primary-600';
    }
  };

  const getTextStyles = (): string => {
    if (variant === 'outline') {
      return 'text-primary-600';
    }
    return 'text-white';
  };

  const getSizeStyles = (): string => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-3 px-6';
      case 'lg':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextSizeStyles = (): string => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg
        flex-row
        items-center
        justify-center
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `.trim()}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`${getTextStyles()} ${getTextSizeStyles()} font-semibold text-center`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

