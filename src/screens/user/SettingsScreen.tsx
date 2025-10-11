import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeSelector from '../../components/ThemeSelector';
import { NavigationProp } from '../../types';

interface SettingsScreenProps {
  navigation: NavigationProp;
}

export default function SettingsScreen({
  navigation: _navigation,
}: SettingsScreenProps) {
  const { logout, user } = useAuthStore();
  const { colors, themeMode } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled automatically
          } catch {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System Default';
      default:
        return 'System Default';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      marginBottom: 8,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    settingValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    chevron: {
      fontSize: 16,
      color: colors.textTertiary,
    },
    themeValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Account Info */}
        <Card title="Account Information">
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Email</Text>
            <Text className="text-gray-900 font-semibold">{user?.email}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Role</Text>
            <Text className="text-gray-900 font-semibold capitalize">
              {user?.role}
            </Text>
          </View>

          {user?.id && (
            <View>
              <Text className="text-gray-600 text-sm mb-1">User ID</Text>
              <Text className="text-gray-900 font-mono text-xs">{user.id}</Text>
            </View>
          )}
        </Card>

        {/* App Settings */}
        <Card title="Preferences">
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowThemeSelector(true)}
          >
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.themeValueContainer}>
              <Text style={styles.settingValue}>{getThemeLabel()}</Text>
              <Text style={styles.chevron}> ›</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Card title="About">
          <Text className="text-gray-600 text-sm mb-2">ALCRM Mobile</Text>
          <Text className="text-gray-600 text-sm mb-4">Version 1.0.0</Text>
          <Text className="text-gray-500 text-xs">
            © 2025 ALCRM. All rights reserved.
          </Text>
        </Card>

        {/* Logout */}
        <Button title="Logout" onPress={handleLogout} variant="danger" />
      </ScrollView>

      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </View>
  );
}
