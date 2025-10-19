import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useMentorshipStore } from '../../stores/mentorshipStore';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { CareerMentor } from '../../types';
import { NavigationProp } from '../../types';

interface MentorshipScreenProps {
  navigation: NavigationProp;
}

export default function MentorshipScreen({
  navigation,
}: MentorshipScreenProps) {
  const { mentors, fetchMentors, isLoading, pagination } = useMentorshipStore();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 16,
      marginBottom: 12,
    },
    domainFilter: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    domainButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    domainButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    domainButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    domainButtonTextActive: {
      color: colors.textInverse,
    },
    content: {
      flex: 1,
    },
    mentorsList: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    emptyText: {
      color: colors.textSecondary,
      marginBottom: 16,
    },
    mentorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    mentorAvatar: {
      width: 60,
      height: 60,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    mentorAvatarText: {
      fontSize: 24,
      color: colors.primary,
      fontWeight: 'bold',
    },
    mentorInfo: {
      flex: 1,
    },
    mentorName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    mentorTitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    mentorExperience: {
      color: colors.textTertiary,
      fontSize: 12,
    },
    mentorMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    mentorRating: {
      color: colors.textSecondary,
      fontSize: 14,
      marginRight: 16,
    },
    mentorPrice: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    mentorDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    mentorDomains: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    mentorActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bookButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    bookButtonText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: '600',
    },
    viewProfileButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    viewProfileButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  const domains = [
    'Technology',
    'Finance',
    'Healthcare',
    'Marketing',
    'Sales',
    'Operations',
    'Human Resources',
    'Consulting',
  ];

  const loadMentors = useCallback(async () => {
    await fetchMentors({
      search: searchQuery,
      domain: selectedDomain,
      page: 1,
      pageSize: 20,
    });
  }, [fetchMentors, searchQuery, selectedDomain]);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMentors();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleDomainFilter = (domain: string) => {
    setSelectedDomain(selectedDomain === domain ? '' : domain);
  };

  const handleViewMentor = (mentor: CareerMentor) => {
    navigation.navigate('MentorDetail', { mentorId: mentor.mentor_id });
  };

  const handleBookSession = (mentor: CareerMentor) => {
    navigation.navigate('MentorDetail', { mentorId: mentor.mentor_id });
  };

  if (isLoading && !refreshing && mentors.length === 0) {
    return <LoadingSpinner message="Loading mentors..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.domainFilter}>
            <TouchableOpacity
              style={[
                styles.domainButton,
                !selectedDomain && styles.domainButtonActive,
              ]}
              onPress={() => handleDomainFilter('')}
            >
              <Text
                style={[
                  styles.domainButtonText,
                  !selectedDomain && styles.domainButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {domains.map(domain => (
              <TouchableOpacity
                key={domain}
                style={[
                  styles.domainButton,
                  selectedDomain === domain && styles.domainButtonActive,
                ]}
                onPress={() => handleDomainFilter(domain)}
              >
                <Text
                  style={[
                    styles.domainButtonText,
                    selectedDomain === domain && styles.domainButtonTextActive,
                  ]}
                >
                  {domain}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mentorsList}>
          <Text style={styles.emptyText}>
            {pagination.mentors.total} mentor
            {pagination.mentors.total !== 1 ? 's' : ''} available
          </Text>

          {mentors.length === 0 ? (
            <EmptyState
              title="No Mentors Found"
              message="Try adjusting your search criteria or check back later for new mentors."
            />
          ) : (
            mentors.map(mentor => (
              <Card key={mentor.mentor_id}>
                <View style={styles.mentorHeader}>
                  <View style={styles.mentorAvatar}>
                    <Text style={styles.mentorAvatarText}>
                      {mentor.user?.first_name?.[0] || 'M'}
                    </Text>
                  </View>
                  <View style={styles.mentorInfo}>
                    <Text style={styles.mentorName}>
                      {mentor.user?.first_name} {mentor.user?.last_name}
                    </Text>
                    <Text style={styles.mentorTitle}>
                      {mentor.domain || 'Career Mentor'}
                    </Text>
                    <Text style={styles.mentorExperience}>
                      {mentor.experience_years}+ years experience
                    </Text>
                  </View>
                </View>

                <View style={styles.mentorMeta}>
                  <Text style={styles.mentorRating}>
                    ⭐ {mentor.rating?.toFixed(1) || '0.0'} ({mentor.total_sessions || 0} sessions)
                  </Text>
                  <Text style={styles.mentorPrice}>
                    ₹{mentor.hourly_rate || 0}/hour
                  </Text>
                </View>

                {mentor.bio && (
                  <Text style={styles.mentorDescription} numberOfLines={3}>
                    {mentor.bio}
                  </Text>
                )}

                <View style={styles.mentorDomains}>
                  <Badge text={mentor.domain} variant="info" />
                </View>

                <View style={styles.mentorActions}>
                  <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => handleViewMentor(mentor)}
                  >
                    <Text style={styles.viewProfileButtonText}>
                      View Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBookSession(mentor)}
                  >
                    <Text style={styles.bookButtonText}>Book Session</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
