import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeMode } from '../stores/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

interface ThemeOnboardingProps {
  onComplete: () => void;
}

const ThemeOnboarding: React.FC<ThemeOnboardingProps> = ({ onComplete }) => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(themeMode);

  const themeOptions: {
    mode: ThemeMode;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      mode: 'light',
      label: 'Light',
      description: 'Clean and bright interface',
      icon: '☀️',
    },
    {
      mode: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: '🌙',
    },
    {
      mode: 'system',
      label: 'System Default',
      description: 'Follows your device setting',
      icon: '⚙️',
    },
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    setSelectedMode(mode);
    setThemeMode(mode);
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      onComplete();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 60,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    themeSection: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'center',
    },
    optionsContainer: {
      gap: 16,
    },
    option: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.border,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionIcon: {
      fontSize: 32,
      marginRight: 16,
    },
    optionText: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmarkText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: 'bold',
    },
    footer: {
      alignItems: 'center',
    },
    continueButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 40,
      paddingVertical: 16,
      borderRadius: 12,
      minWidth: width * 0.6,
    },
    continueButtonText: {
      color: colors.textInverse,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    skipButton: {
      marginTop: 16,
      paddingVertical: 12,
    },
    skipButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Theme</Text>
          <Text style={styles.subtitle}>
            Select how you&apos;d like the app to look. You can change this
            anytime in settings.
          </Text>
        </View>

        <View style={styles.themeSection}>
          <Text style={styles.sectionTitle}>Theme Preference</Text>

          <View style={styles.optionsContainer}>
            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.option,
                  selectedMode === option.mode && styles.selectedOption,
                ]}
                onPress={() => handleThemeSelect(option.mode)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>

                  {selectedMode === option.mode && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleComplete}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleComplete}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ThemeOnboarding;
