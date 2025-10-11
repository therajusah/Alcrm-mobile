import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Appearance } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeMode } from '../stores/themeStore';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const systemColorScheme = Appearance.getColorScheme();

  const themeOptions: {
    mode: ThemeMode;
    label: string;
    description: string;
  }[] = [
    {
      mode: 'light',
      label: 'Light',
      description: 'Always use light theme',
    },
    {
      mode: 'dark',
      label: 'Dark',
      description: 'Always use dark theme',
    },
    {
      mode: 'system',
      label: 'System Default',
      description: `Follow device setting (Currently: ${systemColorScheme === 'dark' ? 'Dark' : 'Light'})`,
    },
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.surfaceSecondary,
    },
    selectedOption: {
      backgroundColor: `${colors.primary}20`,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    checkmark: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmarkText: {
      color: colors.textInverse,
      fontSize: 12,
      fontWeight: 'bold',
    },
    statusIndicator: {
      backgroundColor: `${colors.primary}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    statusText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 4,
    },
    statusSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Choose Theme</Text>

            {themeMode === 'system' && (
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  🔄 Auto-switching is active
                </Text>
                <Text style={styles.statusSubtext}>
                  Theme will change automatically when you switch your device
                  theme
                </Text>
              </View>
            )}

            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.option,
                  themeMode === option.mode && styles.selectedOption,
                ]}
                onPress={() => handleThemeSelect(option.mode)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                {themeMode === option.mode && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default ThemeSelector;
