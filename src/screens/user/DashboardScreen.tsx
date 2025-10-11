import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useJobStore } from '../../stores/jobStore';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { UserProfile } from '../../types';
import { NavigationProp } from '../../types';

interface DashboardScreenProps {
  navigation: NavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useAuthStore();
  const { jobs, fetchJobs, isLoading } = useJobStore();
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 32,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: {
      color: colors.textInverse,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    headerSubtitle: {
      color: colors.textInverse + 'CC',
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 24,
      marginTop: 24,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    quickActionCard: {
      backgroundColor: colors.primary + '10',
      padding: 16,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 4,
    },
    quickActionText: {
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    seeAllText: {
      color: colors.primary,
      fontWeight: '600',
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      fontSize: 16,
    },
    jobCard: {
      marginBottom: 12,
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    jobCompany: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    jobMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    jobMetaText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginRight: 16,
    },
    jobFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    jobDate: {
      color: colors.textTertiary,
      fontSize: 12,
    },
  });

  const loadData = useCallback(async () => {
    try {
      await fetchJobs({ page: 1, pageSize: 5 });
      const profileData = await userApi.getProfile();
      setProfile(profileData);
    } catch {
      // Handle error silently or show user-friendly message
    }
  }, [fetchJobs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case 'FULL-TIME':
        return <Badge text="Full-Time" variant="success" />;
      case 'PART-TIME':
        return <Badge text="Part-Time" variant="info" />;
      case 'CONTRACT':
        return <Badge text="Contract" variant="warning" />;
      case 'INTERNSHIP':
        return <Badge text="Internship" variant="default" />;
      default:
        return <Badge text={type} />;
    }
  };

  const userFirstName =
    profile?.first_name ||
    user?.first_name ||
    user?.email?.split('@')[0] ||
    'User';

  if (isLoading && !refreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome back, {userFirstName}!
        </Text>
        <Text style={styles.headerSubtitle}>
          Checkout the latest job openings
        </Text>
      </View>

      <View style={styles.content}>
        {/* Quick Actions */}
        <Card title="Quick Actions">
          <View style={styles.quickActions}>
            <TouchableOpacity
              key="browse-jobs"
              onPress={() => navigation.navigate('Jobs')}
              style={styles.quickActionCard}
            >
              <Text style={styles.quickActionText}>
                Browse Jobs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              key="my-applications"
              onPress={() => navigation.navigate('Applications')}
              style={[styles.quickActionCard, { backgroundColor: colors.success + '10' }]}
            >
              <Text style={[styles.quickActionText, { color: colors.success }]}>
                My Applications
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Jobs */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Job Postings
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {jobs.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                No jobs available
              </Text>
            </Card>
          ) : (
            jobs.map(job => (
              <Card
                key={job.id}
                onPress={() => {
                  if (job.id) {
                    navigation.navigate('JobDetail', { jobId: job.id });
                  } else {
                    console.error('Job ID is missing:', job);
                    Alert.alert(
                      'Error',
                      'Job ID is missing. Please try again.'
                    );
                  }
                }}
              >
                <View style={styles.jobCard}>
                  <Text style={styles.jobTitle}>
                    {job.title}
                  </Text>
                  {job.company_name && (
                    <Text style={styles.jobCompany}>
                      {job.company_name}
                    </Text>
                  )}
                </View>

                <View style={styles.jobMeta}>
                  <Text style={styles.jobMetaText}>
                    📍 {job.location}
                  </Text>
                  <Text style={styles.jobMetaText}>
                    💰 {job.salary ? `₹${job.salary}L` : 'Salary not specified'}
                  </Text>
                </View>

                <View style={styles.jobFooter}>
                  {getJobTypeBadge(job.type)}
                  <Text style={styles.jobDate}>
                    {new Date(job.postedDate || '').toLocaleDateString()}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
