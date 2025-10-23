import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeSelector from '../../components/ThemeSelector';
import { NavigationProp } from '../../types';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';

interface SettingsScreenProps {
  navigation: NavigationProp;
}

export default function SettingsScreen({
  navigation: _navigation,
}: SettingsScreenProps) {
  const { logout, user } = useAuthStore();
  const { colors, themeMode } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { showAlert, hideAlert, alertState } = useModernAlert();

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: hideAlert,
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          hideAlert();
          try {
            await logout();
            // Navigation will be handled automatically
          } catch {
            showAlert('Error', 'Failed to logout', [
              {
                text: 'OK',
                onPress: hideAlert,
              },
            ]);
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
    accountInfoRow: {
      marginBottom: 12,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    value: {
      color: colors.text,
      fontWeight: '600',
    },
    userIdValue: {
      color: colors.text,
      fontFamily: 'monospace',
      fontSize: 12,
    },
    aboutContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    aboutLogo: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    aboutText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 8,
    },
    aboutVersion: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 16,
    },
    copyright: {
      color: colors.textTertiary,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Account Info */}
        <Card title="Account Information">
          <View style={styles.accountInfoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.accountInfoRow}>
            <Text style={styles.label}>Role</Text>
            <Text style={[styles.value, { textTransform: 'capitalize' }]}>
              {user?.role}
            </Text>
          </View>

          {user?.id && (
            <View>
              <Text style={styles.label}>User ID</Text>
              <Text style={styles.userIdValue}>{user.id}</Text>
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
          <View style={styles.aboutContainer}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.aboutLogo}
              resizeMode="contain"
            />
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.copyright}>
              © 2025 ALCRM. All rights reserved.
            </Text>
          </View>
        </Card>

        {/* Logout */}
        <Button title="Logout" onPress={handleLogout} variant="danger" />
      </ScrollView>

      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      <ModernAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </View>
  );
}
