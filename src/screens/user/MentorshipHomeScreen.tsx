import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useMentorshipStore } from '../../stores/mentorshipStore';
import ServiceCard from '../../components/ServiceCard';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { NavigationProp } from '../../types';

// Service types with pricing
const services = [
  {
    id: 'CV_REVIEW',
    title: 'Resume Review',
    price: 1200,
    duration: 30,
    icon: 'document-text-outline',
    description: 'Professional CV/resume review and feedback',
  },
  {
    id: 'MOCK_INTERVIEW',
    title: 'Mock Interview',
    price: 2500,
    duration: 60,
    icon: 'briefcase-outline',
    description: 'Practice technical/behavioral interviews',
  },
  {
    id: 'DOMAIN_COACHING',
    title: 'Skill Development',
    price: 2000,
    duration: 60,
    icon: 'school-outline',
    description: 'Targeted skill improvement coaching',
  },
  {
    id: 'BEHAVIORAL_PREP',
    title: 'Career Guidance',
    price: 1500,
    duration: 45,
    icon: 'people-outline',
    description: 'One-on-one career planning and guidance',
  },
  {
    id: 'INDUSTRY_INSIGHTS',
    title: 'Industry Insights',
    price: 1800,
    duration: 45,
    icon: 'trending-up-outline',
    description: 'Learn about industry trends',
  },
];

export default function MentorshipHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { mentors, fetchMentors, isLoading, pagination } = useMentorshipStore();
  const [activeTab, setActiveTab] = useState<'services' | 'sessions'>(
    'services'
  );
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      padding: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    servicesContent: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    mentorsList: {
      marginTop: 24,
    },
    mentorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    mentorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    mentorAvatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    mentorInfo: {
      flex: 1,
    },
    mentorName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    mentorDomain: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    mentorExperience: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    viewAllButton: {
      backgroundColor: colors.surfaceSecondary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    viewAllButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    becomeMentorButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 24,
    },
    becomeMentorButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentors({ page: 1, pageSize: 5 });
    setRefreshing(false);
  };

  const handleServicePress = (service: (typeof services)[0]) => {
    navigation.navigate('BookSession', {
      serviceType: service.id,
      serviceTitle: service.title,
      price: service.price,
      duration: service.duration,
    });
  };

  const handleViewAllMentors = () => {
    navigation.navigate('BrowseMentors');
  };

  const handleMentorPress = (mentorId: string) => {
    navigation.navigate('MentorDetail', { mentorId });
  };

  React.useEffect(() => {
    if (activeTab === 'services') {
      fetchMentors({ page: 1, pageSize: 5 });
    }
  }, [activeTab, fetchMentors]);

  // Handle navigation when sessions tab is selected
  React.useEffect(() => {
    if (activeTab === 'sessions') {
      navigation.navigate('MySessions');
    }
  }, [activeTab, navigation]);

  const renderServices = () => (
    <ScrollView
      style={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.servicesContent}>
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.servicesGrid}>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              title={service.title}
              price={service.price}
              duration={service.duration}
              icon={service.icon}
              description={service.description}
              onPress={() => handleServicePress(service)}
            />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Available Mentors
        </Text>

        {isLoading && mentors.length === 0 ? (
          <LoadingSpinner message="Loading mentors..." />
        ) : mentors.length === 0 ? (
          <EmptyState
            title="No Mentors Available"
            message="Check back later for new mentors."
          />
        ) : (
          <Card>
            <View style={styles.mentorsList}>
              {mentors.slice(0, 5).map(mentor => (
                <TouchableOpacity
                  key={mentor.mentor_id}
                  style={styles.mentorCard}
                  onPress={() => handleMentorPress(mentor.mentor_id)}
                >
                  <View style={styles.mentorAvatar}>
                    <Text style={styles.mentorAvatarText}>
                      {mentor.user?.first_name?.[0] || 'M'}
                    </Text>
                  </View>
                  <View style={styles.mentorInfo}>
                    <Text style={styles.mentorName}>
                      {mentor.user?.first_name} {mentor.user?.last_name}
                    </Text>
                    <Text style={styles.mentorDomain}>
                      {mentor.domain || 'Career Mentor'}
                    </Text>
                    <Text style={styles.mentorExperience}>
                      • {mentor.experience_years}+ years experience
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {mentors.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAllMentors}
          >
            <Text style={styles.viewAllButtonText}>
              View All {pagination.mentors.total} Mentors
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  const renderSessions = () => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'services' && styles.activeTab]}
          onPress={() => setActiveTab('services')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'services' && styles.activeTabText,
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
          onPress={() => setActiveTab('sessions')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sessions' && styles.activeTabText,
            ]}
          >
            My Sessions
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'services' ? renderServices() : renderSessions()}
    </View>
  );
}
