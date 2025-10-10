import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useJobStore } from '../../stores/jobStore';
import { userApi } from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { UserProfile } from '../../types';

interface DashboardScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useAuthStore();
  const { jobs, fetchJobs, isLoading } = useJobStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-primary-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold mb-2">
          Welcome back, {userFirstName}!
        </Text>
        <Text className="text-primary-100 text-base">
          Checkout the latest job openings
        </Text>
      </View>

      <View className="px-6 mt-6">
        {/* Quick Actions */}
        <Card title="Quick Actions" className="mb-4">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate('Jobs')}
              className="bg-primary-50 p-4 rounded-lg flex-1 mr-2"
            >
              <Text className="text-primary-600 font-semibold text-center">
                Browse Jobs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Applications')}
              className="bg-green-50 p-4 rounded-lg flex-1 ml-2"
            >
              <Text className="text-green-600 font-semibold text-center">
                My Applications
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Jobs */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Recent Job Postings
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text className="text-primary-600 font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          {jobs.length === 0 ? (
            <Card>
              <Text className="text-gray-500 text-center">
                No jobs available
              </Text>
            </Card>
          ) : (
            jobs.map(job => (
              <Card
                key={job.job_id}
                onPress={() =>
                  navigation.navigate('JobDetail', { jobId: job.job_id })
                }
              >
                <View className="mb-3">
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {job.title}
                  </Text>
                  {job.company_name && (
                    <Text className="text-gray-600 text-sm">
                      {job.company_name}
                    </Text>
                  )}
                </View>

                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 text-sm mr-4">
                    📍 {job.location}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    💰 {job.salary_range}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  {getJobTypeBadge(job.job_type)}
                  <Text className="text-gray-500 text-xs">
                    {new Date(job.created_at || '').toLocaleDateString()}
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
