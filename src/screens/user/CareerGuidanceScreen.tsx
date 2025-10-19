import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import { NavigationProp } from '../../types';
import { DASHBOARD_BASE_URL } from '../../config/api';

export default function CareerGuidanceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    header: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    servicesGrid: {
      marginBottom: 24,
    },
    serviceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    serviceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    serviceInfo: {
      flex: 1,
    },
    serviceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    serviceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    serviceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    servicePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginRight: 16,
    },
    serviceDuration: {
      fontSize: 14,
      color: colors.textTertiary,
    },
    serviceFeatures: {
      marginTop: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    featureText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    actionButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    statsContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    quickActions: {
      marginBottom: 24,
    },
    quickActionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    quickActionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickActionButton: {
      backgroundColor: colors.surfaceSecondary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flex: 1,
      minWidth: '45%',
    },
    quickActionButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  const services = [
    {
      id: 'cv-review',
      title: 'CV Review & Enhancement',
      description:
        'Professional resume review and enhancement by industry experts',
      icon: '📄',
      price: '₹2,999',
      duration: '3-5 days',
      color: colors.primary,
      features: [
        'Comprehensive content analysis',
        'ATS optimization',
        'Industry-specific improvements',
        'Professional formatting',
      ],
      onPress: () => {
        // Navigate to CV Review screen or open web view
        navigation.navigate('CVReview');
      },
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      description: 'Mock interviews and domain-specific coaching sessions',
      icon: '◯',
      price: '₹1,999-3,999',
      duration: '30-60 min',
      color: colors.success,
      features: [
        'Mock interview sessions',
        'Domain-specific coaching',
        'Behavioral prep',
        'Real-time feedback',
      ],
      onPress: () => {
        navigation.navigate('InterviewPrep');
      },
    },
    {
      id: 'mentorship',
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals for career guidance',
      icon: '👥',
      price: '₹1,500-2,500',
      duration: '45-60 min',
      color: colors.warning,
      features: [
        'Career guidance',
        'Industry insights',
        'Skill development',
        'Network building',
      ],
      onPress: () => {
        navigation.navigate('Mentorship');
      },
    },
    {
      id: 'personal-references',
      title: 'Personal Job References',
      description: 'Get direct referrals to top organizations',
      icon: '🤝',
      price: '₹4,999',
      duration: '5-7 days',
      color: colors.info,
      features: [
        'Direct referrals',
        'Priority consideration',
        'Insider information',
        'Network access',
      ],
      onPress: () => {
        navigation.navigate('PersonalReferences');
      },
    },
  ];

  const quickActions = [
    {
      title: 'Browse Mentors',
      onPress: () => navigation.navigate('Mentorship'),
    },
    {
      title: 'My Sessions',
      onPress: () => navigation.navigate('MySessions'),
    },
    {
      title: 'Upload Resume',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'View Resources',
      onPress: () => navigation.navigate('Resources'),
    },
  ];

  const handleServicePress = (service: (typeof services)[0]) => {
    service.onPress();
  };

  const handleWebViewOpen = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Success Stats */}
        <Card>
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Our Success Metrics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>92%</Text>
                <Text style={styles.statLabel}>Interview Success Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.8/5</Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>500+</Text>
                <Text style={styles.statLabel}>Successful Placements</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionTitle}>Quick Actions</Text>
          <View style={styles.quickActionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={action.onPress}
              >
                <Text style={styles.quickActionButtonText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.servicesGrid}>
          <Text style={styles.quickActionTitle}>Available Services</Text>
          {services.map(service => (
            <Card key={service.id}>
              <View style={styles.serviceHeader}>
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: `${service.color}20` },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{service.icon}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                  <View style={styles.serviceMeta}>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <Text style={styles.serviceDuration}>
                      {service.duration}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.serviceFeatures}>
                {service.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={{ color: colors.success }}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleServicePress(service)}
              >
                <Text style={styles.actionButtonText}>Get Started</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Additional Options */}
        <Card>
          <View style={styles.serviceHeader}>
            <View
              style={[
                styles.serviceIcon,
                { backgroundColor: `${colors.info}20` },
              ]}
            >
              <Text style={{ fontSize: 24 }}>🌐</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Web Dashboard</Text>
              <Text style={styles.serviceDescription}>
                Access our full-featured web dashboard for detailed forms and
                advanced features
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleWebViewOpen(`${DASHBOARD_BASE_URL}/career-guidance`)
            }
          >
            <Text style={styles.actionButtonText}>Open Web Dashboard</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}
