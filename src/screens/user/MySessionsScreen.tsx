import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMentorshipStore } from '../../stores/mentorshipStore';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { MentorshipSession } from '../../types';
import { NavigationProp } from '../../types';

interface MySessionsScreenProps {
  navigation: NavigationProp;
}

export default function MySessionsScreen({
  navigation,
}: MySessionsScreenProps) {
  const { sessions, fetchSessions, isLoading, pagination } =
    useMentorshipStore();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: colors.textInverse,
    },
    content: {
      flex: 1,
    },
    sessionsList: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    emptyText: {
      color: colors.textSecondary,
      marginBottom: 16,
    },
    sessionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sessionAvatar: {
      width: 50,
      height: 50,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    sessionAvatarText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: 'bold',
    },
    sessionInfo: {
      flex: 1,
    },
    sessionMentor: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    sessionType: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    sessionMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sessionDate: {
      color: colors.textSecondary,
      fontSize: 14,
      marginRight: 16,
    },
    sessionPrice: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    sessionNotes: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 12,
    },
    sessionActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    cancelButton: {
      borderColor: colors.error,
    },
    cancelButtonText: {
      color: colors.error,
    },
  });

  const statusFilters = [
    { key: '', label: 'All' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const loadSessions = useCallback(async () => {
    await fetchSessions({
      status: selectedStatus,
      page: 1,
      pageSize: 20,
    });
  }, [fetchSessions, selectedStatus]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handleViewSession = (session: MentorshipSession) => {
    navigation.navigate('MentorshipSessionDetail', {
      sessionId: session.session_id,
    });
  };

  const handleCancelSession = async (session: MentorshipSession) => {
    Alert.alert(
      'Cancel Session',
      'Are you sure you want to cancel this session?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await useMentorshipStore
                .getState()
                .cancelSession(session.session_id);
              Alert.alert('Success', 'Session cancelled successfully');
              await loadSessions();
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to cancel session';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SCHEDULED':
        return <Badge text="Scheduled" variant="info" />;
      case 'COMPLETED':
        return <Badge text="Completed" variant="success" />;
      case 'CANCELLED':
        return <Badge text="Cancelled" variant="danger" />;
      case 'IN_PROGRESS':
        return <Badge text="In Progress" variant="warning" />;
      default:
        return <Badge text={status} variant="default" />;
    }
  };

  if (isLoading && !refreshing && sessions.length === 0) {
    return <LoadingSpinner message="Loading sessions..." />;
  }

  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {statusFilters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedStatus === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => handleStatusFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedStatus === filter.key &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
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
        <View style={styles.sessionsList}>
          <Text style={styles.emptyText}>
            {pagination.sessions.total} session
            {pagination.sessions.total !== 1 ? 's' : ''} found
          </Text>

          {sessions.length === 0 ? (
            <EmptyState
              title="No Sessions Found"
              message="You haven't booked any mentorship sessions yet."
            />
          ) : (
            sessions.map(session => (
              <Card key={session.session_id}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionAvatar}>
                    <Text style={styles.sessionAvatarText}>{'M'}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionMentor}>{'Mentor Name'}</Text>
                    <Text style={styles.sessionType}>
                      {session.session_type?.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionMeta}>
                  <Text style={styles.sessionDate}>
                    📅{' '}
                    {new Date(session.scheduled_at || '').toLocaleDateString()}
                  </Text>
                  <Text style={styles.sessionPrice}>₹500</Text>
                </View>

                {session.notes && (
                  <Text style={styles.sessionNotes} numberOfLines={2}>
                    {session.notes}
                  </Text>
                )}

                <View style={styles.sessionActions}>
                  {getStatusBadge(session.status)}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleViewSession(session)}
                    >
                      <Text style={styles.actionButtonText}>View Details</Text>
                    </TouchableOpacity>
                    {session.status === 'SCHEDULED' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancelSession(session)}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            styles.cancelButtonText,
                          ]}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
