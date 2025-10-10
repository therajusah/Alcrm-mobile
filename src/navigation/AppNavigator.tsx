import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// User Screens
import DashboardScreen from '../screens/user/DashboardScreen';
import JobsScreen from '../screens/user/JobsScreen';
import JobDetailScreen from '../screens/user/JobDetailScreen';
import ApplicationsScreen from '../screens/user/ApplicationsScreen';
import ResourcesScreen from '../screens/user/ResourcesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          headerTitle: 'Browse Jobs',
          tabBarIcon: ({ color }) => <TabIcon icon="💼" color={color} />,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          headerTitle: 'My Applications',
          tabBarIcon: ({ color }) => <TabIcon icon="📋" color={color} />,
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          headerTitle: 'Free Resources',
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'My Profile',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple icon component
function TabIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <text style={StyleSheet.flatten([styles.tabIcon, { color }])}>{icon}</text>
  );
}

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen
            name="UserTabs"
            component={UserTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobDetail"
            component={JobDetailScreen}
            options={{ headerTitle: 'Job Details' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerTitle: 'Settings' }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ headerTitle: 'Change Password' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24,
  },
});
