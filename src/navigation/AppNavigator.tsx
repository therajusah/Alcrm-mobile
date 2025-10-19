import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/authStore';
import { userApi } from '../services/api';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeOnboarding from '../components/ThemeOnboarding';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// User Screens
import DashboardScreen from '../screens/user/DashboardScreen';
import JobsScreen from '../screens/user/JobsScreen';
import JobDetailScreen from '../screens/user/JobDetailScreen';
import ApplicationsScreen from '../screens/user/ApplicationsScreen';
import ResourcesScreen from '../screens/user/ResourcesScreen';
import MentorshipScreen from '../screens/user/MentorshipScreen';
import MentorDetailScreen from '../screens/user/MentorDetailScreen';
import MySessionsScreen from '../screens/user/MySessionsScreen';
import CareerGuidanceScreen from '../screens/user/CareerGuidanceScreen';
import CVReviewScreen from '../screens/user/CVReviewScreen';
import InterviewPrepScreen from '../screens/user/InterviewPrepScreen';
import PersonalReferencesScreen from '../screens/user/PersonalReferencesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';
import MentorshipSessionDetailScreen from '../screens/user/MentorshipSessionDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
function UserTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
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
        name="Mentorship"
        component={MentorshipScreen}
        options={{
          headerTitle: 'Find Mentors',
          tabBarIcon: ({ color }) => <TabIcon icon="🎯" color={color} />,
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
    <Text style={StyleSheet.flatten([styles.tabIcon, { color }])}>{icon}</Text>
  );
}

// Auth Stack
function AuthStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
function AppNavigatorContent() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { colors } = useTheme();
  const [showThemeOnboarding, setShowThemeOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [needsProfileOnboarding, setNeedsProfileOnboarding] = useState(false);

  useEffect(() => {
    checkAuth();
    checkOnboardingStatus();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      checkProfileOnboarding();
    }
  }, [isAuthenticated, isLoading]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(
        '@onboarding_completed'
      );
      setShowThemeOnboarding(!onboardingCompleted);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowThemeOnboarding(false);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  const checkProfileOnboarding = async () => {
    try {
      const onboardingState = await userApi.getOnboardingState();
      setNeedsProfileOnboarding(!onboardingState.is_completed);
    } catch (error) {
      console.log('Error checking profile onboarding:', error);
      setNeedsProfileOnboarding(false);
    }
  };

  const handleThemeOnboardingComplete = () => {
    setShowThemeOnboarding(false);
  };

  if (isLoading || isCheckingOnboarding) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (showThemeOnboarding) {
    return <ThemeOnboarding onComplete={handleThemeOnboardingComplete} />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false, // We handle dark mode manually
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      {isAuthenticated ? (
        <Stack.Navigator
          initialRouteName={needsProfileOnboarding ? 'Onboarding' : 'UserTabs'}
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserTabs"
            component={UserTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobDetail"
            component={JobDetailScreen}
            options={{ headerTitle: 'Job Details' }}
          />
          <Stack.Screen
            name="MentorDetail"
            component={MentorDetailScreen}
            options={{ headerTitle: 'Mentor Profile' }}
          />
          <Stack.Screen
            name="MySessions"
            component={MySessionsScreen}
            options={{ headerTitle: 'My Sessions' }}
          />
          <Stack.Screen
            name="CareerGuidance"
            component={CareerGuidanceScreen}
            options={{ headerTitle: 'Career Guidance' }}
          />
          <Stack.Screen
            name="CVReview"
            component={CVReviewScreen}
            options={{ headerTitle: 'CV Review' }}
          />
          <Stack.Screen
            name="InterviewPrep"
            component={InterviewPrepScreen}
            options={{ headerTitle: 'Interview Prep' }}
          />
          <Stack.Screen
            name="PersonalReferences"
            component={PersonalReferencesScreen}
            options={{ headerTitle: 'Personal References' }}
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
          <Stack.Screen
            name="MentorshipSessionDetail"
            component={MentorshipSessionDetailScreen}
            options={{ headerTitle: 'Session Details' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

// Wrapper with ThemeProvider
export default function AppNavigator() {
  return (
    <ThemeProvider>
      <AppNavigatorContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24,
  },
});
