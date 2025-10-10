import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function SettingsScreen({ navigation }: any) {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-6">
        {/* Account Info */}
        <Card title="Account Information">
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Email</Text>
            <Text className="text-gray-900 font-semibold">{user?.email}</Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Role</Text>
            <Text className="text-gray-900 font-semibold capitalize">{user?.role}</Text>
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
          <Text className="text-gray-600 text-sm mb-4">
            More settings coming soon...
          </Text>
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
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

