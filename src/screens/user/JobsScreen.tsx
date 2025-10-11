import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useJobStore } from '../../stores/jobStore';
import { useTheme } from '../../contexts/ThemeContext';
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
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    },
    content: {
      flex: 1,
    },
    jobsList: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    emptyText: {
      color: colors.textSecondary,
      marginBottom: 16,
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
  });

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
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.jobsList}>
          <Text style={styles.emptyText}>
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

                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  marginBottom: 12,
                }} numberOfLines={2}>
                  {job.description}
                </Text>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginRight: 16,
                  }}>
                    📍 {job.location}
                  </Text>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                  }}>
                    💰 {job.salary ? `₹${job.salary}L` : 'Salary not specified'}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  {getJobTypeBadge(job.type)}
                  <Text style={{
                    color: colors.textTertiary,
                    fontSize: 12,
                  }}>
                    {new Date(job.postedDate || '').toLocaleDateString()}
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
