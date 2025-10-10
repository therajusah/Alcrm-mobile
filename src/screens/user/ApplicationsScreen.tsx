import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useApplicationStore } from '../../stores/applicationStore';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function ApplicationsScreen() {
  const { applications, fetchApplications, isLoading } = useApplicationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications({ page: 1, pageSize: 50 });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications({ page: 1, pageSize: 50 });
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPLIED':
        return <Badge text="Applied" variant="info" />;
      case 'SHARED_WITH_COMPANY':
        return <Badge text="Shared" variant="info" />;
      case 'SHORTLISTED':
        return <Badge text="Shortlisted" variant="warning" />;
      case 'INTERVIEW_SCHEDULED':
        return <Badge text="Interview" variant="warning" />;
      case 'INTERVIEW_COMPLETED':
        return <Badge text="Interviewed" variant="info" />;
      case 'SELECTED':
        return <Badge text="Selected" variant="success" />;
      case 'REJECTED':
        return <Badge text="Rejected" variant="danger" />;
      case 'WITHDRAWN':
        return <Badge text="Withdrawn" variant="default" />;
      default:
        return <Badge text={status} />;
    }
  };

  if (isLoading && !refreshing && applications.length === 0) {
    return <LoadingSpinner message="Loading applications..." />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          My Applications ({applications.length})
        </Text>

        {applications.length === 0 ? (
          <EmptyState
            title="No Applications Yet"
            message="Start applying for jobs to see them here"
          />
        ) : (
          applications.map((application) => (
            <Card key={application.application_id}>
              <View className="mb-3">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {application.job_title || 'Job Title'}
                </Text>
                {application.job_location && (
                  <Text className="text-gray-600 text-sm">📍 {application.job_location}</Text>
                )}
              </View>

              {application.job_salary && (
                <Text className="text-gray-600 text-sm mb-3">
                  💰 {application.job_salary}
                </Text>
              )}

              <View className="flex-row items-center justify-between">
                {getStatusBadge(application.status)}
                <Text className="text-gray-500 text-xs">
                  Applied: {new Date(application.application_date).toLocaleDateString()}
                </Text>
              </View>

              {application.cover_letter && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-gray-600 text-xs font-semibold mb-1">Cover Letter:</Text>
                  <Text className="text-gray-700 text-sm" numberOfLines={3}>
                    {application.cover_letter}
                  </Text>
                </View>
              )}
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

