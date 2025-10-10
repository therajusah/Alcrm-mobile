import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useJobStore } from '../../stores/jobStore';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { NavigationProp } from '../../types';

interface JobsScreenProps {
  navigation: NavigationProp;
}

export default function JobsScreen({ navigation }: JobsScreenProps) {
  const { jobs, fetchJobs, isLoading, pagination } = useJobStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs({ page: 1, pageSize: 20 });
  }, [fetchJobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs({ page: 1, pageSize: 20, search: searchQuery });
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      await fetchJobs({ page: 1, pageSize: 20, search: query });
    }
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

  if (isLoading && !refreshing && jobs.length === 0) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
          placeholder="Search jobs..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-4">
          <Text className="text-gray-600 mb-4">
            {pagination.total} job{pagination.total !== 1 ? 's' : ''} available
          </Text>

          {jobs.length === 0 ? (
            <EmptyState
              title="No Jobs Found"
              message="Try adjusting your search criteria"
            />
          ) : (
            jobs.map(job => (
              <Card
                key={job.id}
                onPress={() =>
                  navigation.navigate('JobDetail', { jobId: job.id })
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

                <Text className="text-gray-700 text-sm mb-3" numberOfLines={2}>
                  {job.description}
                </Text>

                <View className="flex-row items-center mb-3">
                  <Text className="text-gray-600 text-sm mr-4">
                    📍 {job.location}
                  </Text>
                  <Text className="text-gray-600 text-sm">💰 {job.salary}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  {getJobTypeBadge(job.type)}
                  <Text className="text-gray-500 text-xs">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
