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
import RateSessionModal from '../../components/RateSessionModal';
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
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSessionForRating, setSelectedSessionForRating] =
    useState<MentorshipSession | null>(null);

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
    sessionCard: {
      marginBottom: 16,
    },
    sessionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    sessionAvatar: {
      width: 50,
      height: 50,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sessionAvatarText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: 'bold',
    },
    sessionInfo: {
      flex: 1,
      marginLeft: 12,
    },
    sessionMentor: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    mentorDomain: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    sessionType: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      textTransform: 'capitalize',
    },
    sessionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    sessionDetails: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    detailValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
    notesContainer: {
      backgroundColor: `${colors.primary}10`,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    notesLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    sessionNotes: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    sessionActions: {
      flexDirection: 'column',
      gap: 8,
      marginTop: 16,
    },
    actionButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
    },
    viewButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    viewButtonText: {
      color: colors.textInverse,
      fontSize: 15,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderColor: colors.error,
    },
    cancelButtonText: {
      color: colors.error,
      fontSize: 15,
      fontWeight: '600',
    },
    rateButton: {
      backgroundColor: '#FBBF24',
      borderColor: '#FBBF24',
    },
    rateButtonText: {
      color: '#1F2937',
      fontSize: 15,
      fontWeight: '600',
    },
  });

  const statusFilters = [
    { key: '', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
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

  const handleRateSession = (session: MentorshipSession) => {
    setSelectedSessionForRating(session);
    setRatingModalVisible(true);
  };

  const handleRatingSuccess = async () => {
    setRatingModalVisible(false);
    setSelectedSessionForRating(null);
    await loadSessions();
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
      case 'PENDING':
        return <Badge text="Pending" variant="warning" />;
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
            sessions.map(session => {
              // Get mentor information from the session
              const mentorInfo = (session as any).career_mentors;
              const mentorName = mentorInfo?.users?.first_name && mentorInfo?.users?.last_name
                ? `${mentorInfo.users.first_name} ${mentorInfo.users.last_name}`
                : 'Mentor';
              const mentorInitial = mentorName.charAt(0).toUpperCase();
              
              // Format date nicely
              const formatDate = (dateString: string | null | undefined) => {
                if (!dateString) return 'Not scheduled yet';
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              };
              
              return (
                <Card key={session.session_id}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionAvatar}>
                      <Text style={styles.sessionAvatarText}>{mentorInitial}</Text>
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionMentor}>{mentorName}</Text>
                      {mentorInfo?.domain && (
                        <Text style={styles.mentorDomain}>
                          {mentorInfo.domain}
                        </Text>
                      )}
                      <Text style={styles.sessionType}>
                        {session.session_type?.replace('_', ' ') || 'Session'}
                      </Text>
                    </View>
                    {getStatusBadge(session.status)}
                  </View>

                  <View style={styles.sessionDivider} />

                  <View style={styles.sessionDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📅 Scheduled</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(session.scheduled_at)}
                      </Text>
                    </View>
                    
                    {session.session_duration_minutes && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>⏱ Duration</Text>
                        <Text style={styles.detailValue}>
                          {session.session_duration_minutes} minutes
                        </Text>
                      </View>
                    )}
                    
                    {session.completed_at && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>✅ Completed</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(session.completed_at)}
                        </Text>
                      </View>
                    )}
                    
                    {session.session_rating && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>★ Your Rating</Text>
                        <Text style={styles.detailValue}>
                          {'★'.repeat(session.session_rating)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {session.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Your Notes:</Text>
                      <Text style={styles.sessionNotes} numberOfLines={2}>
                        {session.notes}
                      </Text>
                    </View>
                  )}
                  
                  {session.session_feedback && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Your Feedback:</Text>
                      <Text style={styles.sessionNotes} numberOfLines={2}>
                        {session.session_feedback}
                      </Text>
                    </View>
                  )}

                  <View style={styles.sessionActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => handleViewSession(session)}
                    >
                      <Text style={styles.viewButtonText}>View Full Details</Text>
                    </TouchableOpacity>
                    
                    {(session.status === 'SCHEDULED' ||
                      session.status === 'PENDING') && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleCancelSession(session)}
                      >
                        <Text style={styles.cancelButtonText}>
                          Cancel Session
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {session.status === 'COMPLETED' &&
                      !session.session_rating && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rateButton]}
                          onPress={() => handleRateSession(session)}
                        >
                          <Text style={styles.rateButtonText}>★ Rate Session</Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Rating Modal */}
      {selectedSessionForRating && (
        <RateSessionModal
          visible={ratingModalVisible}
          sessionId={selectedSessionForRating.session_id}
          mentorName="Mentor"
          onClose={() => {
            setRatingModalVisible(false);
            setSelectedSessionForRating(null);
          }}
          onSuccess={handleRatingSuccess}
        />
      )}
    </View>
  );
}
