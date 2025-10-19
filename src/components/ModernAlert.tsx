import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { ColorScheme } from '../styles/colors';

interface ModernAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

// Static styles that don't depend on theme or runtime values
const staticStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  singleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  singleButtonStyle: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
});

// Dynamic styles helper that accepts theme colors
const getDynamicStyles = (colors: ColorScheme) => ({
  container: {
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
  },
  message: {
    color: colors.textSecondary,
  },
});

// Theme-aware button style helpers
const getButtonStyle = (style: string | undefined, colors: ColorScheme) => {
  switch (style) {
    case 'destructive':
      return {
        backgroundColor: colors.error || '#EF4444',
        borderColor: colors.error || '#EF4444',
      };
    case 'cancel':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.border,
      };
    default:
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      };
  }
};

const getButtonTextStyle = (style: string | undefined, colors: ColorScheme) => {
  switch (style) {
    case 'destructive':
      return {
        color: colors.textInverse || '#FFFFFF',
      };
    case 'cancel':
      return {
        color: colors.text,
      };
    default:
      return {
        color: colors.textInverse || '#FFFFFF',
      };
  }
};

const ModernAlert: React.FC<ModernAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onClose,
}) => {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Merge static and dynamic styles
  const dynamicStyles = getDynamicStyles(colors);
  const styles = {
    ...staticStyles,
    container: { ...staticStyles.container, ...dynamicStyles.container },
    title: { ...staticStyles.title, ...dynamicStyles.title },
    message: { ...staticStyles.message, ...dynamicStyles.message },
  };

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  // Safe button handler with error handling
  const handleButtonPress = async (buttonCallback: () => void) => {
    try {
      await Promise.resolve(buttonCallback());
    } catch (error) {
      console.error('ModernAlert button callback error:', error);
    } finally {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {buttons.length === 1 ? (
            <View style={styles.singleButton}>
              <TouchableOpacity
                style={[
                  styles.singleButtonStyle,
                  getButtonStyle(buttons[0].style, colors),
                ]}
                onPress={() => handleButtonPress(buttons[0].onPress)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    getButtonTextStyle(buttons[0].style, colors),
                  ]}
                >
                  {buttons[0].text}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.button, getButtonStyle(button.style, colors)]}
                  onPress={() => handleButtonPress(button.onPress)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      getButtonTextStyle(button.style, colors),
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ModernAlert;
