import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useApplicationStore } from '../../stores/applicationStore';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function ApplicationsScreen() {
  const { applications, fetchApplications, isLoading } = useApplicationStore();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    applicationCard: {
      marginBottom: 12,
    },
    applicationTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    applicationCompany: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    applicationMeta: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 12,
    },
    applicationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    applicationDate: {
      color: colors.textTertiary,
      fontSize: 12,
    },
    applicationActions: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    applicationStatus: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
    },
    applicationNotes: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

  useEffect(() => {
    fetchApplications({ page: 1, pageSize: 50 });
  }, [fetchApplications]);

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
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>
          My Applications ({applications.length})
        </Text>

        {applications.length === 0 ? (
          <EmptyState
            title="No Applications Yet"
            message="Start applying for jobs to see them here"
          />
        ) : (
          applications.map(application => (
            <Card key={application.application_id}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {application.job_title || 'Job Title'}
                </Text>
                {application.job_location && (
                  <Text style={styles.applicationCompany}>
                    📍 {application.job_location}
                  </Text>
                )}
              </View>

              {application.job_salary && (
                <Text style={styles.applicationMeta}>
                  💰 {application.job_salary}
                </Text>
              )}

              <View style={styles.applicationFooter}>
                {getStatusBadge(application.status)}
                <Text style={styles.applicationDate}>
                  Applied:{' '}
                  {new Date(application.application_date).toLocaleDateString()}
                </Text>
              </View>

              {application.cover_letter && (
                <View style={styles.applicationActions}>
                  <Text style={styles.applicationStatus}>Cover Letter:</Text>
                  <Text style={styles.applicationNotes} numberOfLines={3}>
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
