import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NavigationProp, RootStackParamList } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import type { MentorshipSession } from '../../types';

type MentorshipSessionDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'MentorshipSessionDetail'
>;

// Static styles (layout and sizing only, no colors)
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  notFoundText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  detailsSection: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: '600',
  },
  notesText: {
    lineHeight: 24,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingLabel: {
    fontWeight: '600',
    marginBottom: 12,
  },
  feedbackLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  ratedBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  ratedTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  ratedText: {
    fontSize: 14,
  },
});

export default function MentorshipSessionDetailScreen() {
  const route = useRoute<MentorshipSessionDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { sessionId } = route.params;
  const { colors } = useTheme();
  const [session, setSession] = useState<MentorshipSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Theme-dependent styles
  const styles = useMemo(
    () => ({
      container: {
        ...staticStyles.container,
        backgroundColor: colors.backgroundSecondary,
      },
      content: staticStyles.content,
      notFoundContainer: {
        ...staticStyles.notFoundContainer,
        backgroundColor: colors.backgroundSecondary,
      },
      notFoundTitle: {
        ...staticStyles.notFoundTitle,
        color: colors.text,
      },
      notFoundText: {
        ...staticStyles.notFoundText,
        color: colors.textSecondary,
      },
      headerRow: staticStyles.headerRow,
      headerTitle: {
        ...staticStyles.headerTitle,
        color: colors.text,
      },
      typeRow: staticStyles.typeRow,
      durationText: {
        color: colors.textSecondary,
      },
      detailsSection: {
        ...staticStyles.detailsSection,
        borderTopColor: colors.border,
      },
      detailRow: staticStyles.detailRow,
      detailLabel: {
        ...staticStyles.detailLabel,
        color: colors.textSecondary,
      },
      detailValue: {
        ...staticStyles.detailValue,
        color: colors.text,
      },
      notesText: {
        ...staticStyles.notesText,
        color: colors.text,
      },
      ratingStarsRow: staticStyles.ratingStarsRow,
      ratingLabel: {
        ...staticStyles.ratingLabel,
        color: colors.text,
      },
      feedbackLabel: {
        ...staticStyles.feedbackLabel,
        color: colors.text,
      },
      feedbackInput: {
        ...staticStyles.feedbackInput,
        borderColor: colors.inputBorder,
        color: colors.text,
        backgroundColor: colors.inputBackground,
      },
      ratedBox: {
        ...staticStyles.ratedBox,
        backgroundColor: `${colors.success}20`,
        borderColor: `${colors.success}40`,
      },
      ratedTitle: {
        ...staticStyles.ratedTitle,
        color: colors.success,
      },
      ratedText: {
        ...staticStyles.ratedText,
        color: colors.success,
      },
    }),
    [colors]
  );

  const loadSessionDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionData = await userApi.getSessionDetail(sessionId);
      setSession(sessionData);

      // Set existing rating and feedback if available
      if (sessionData.session_rating) {
        setRating(sessionData.session_rating);
      }
      if (sessionData.session_feedback) {
        setFeedback(sessionData.session_feedback);
      }
    } catch (error: unknown) {
      console.log('Failed to load session detail:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load session details';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessionDetail();
  }, [loadSessionDetail]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessionDetail();
    setRefreshing(false);
  };

  const handleRateSession = async () => {
    if (rating === 0) {
      Alert.alert('Required', 'Please select a rating');
      return;
    }

    setIsRating(true);
    try {
      await userApi.rateSession(sessionId, rating, feedback);
      Alert.alert('Success', 'Session rated successfully');
      await loadSessionDetail();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to rate session';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsRating(false);
    }
  };

  const handleCancelSession = async () => {
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
              await userApi.cancelSession(sessionId);
              Alert.alert('Success', 'Session cancelled successfully');
              await loadSessionDetail();
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
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge text="Scheduled" variant="info" />;
      case 'completed':
        return <Badge text="Completed" variant="success" />;
      case 'cancelled':
        return <Badge text="Cancelled" variant="danger" />;
      case 'in_progress':
        return <Badge text="In Progress" variant="warning" />;
      default:
        return <Badge text={status} variant="default" />;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video_call':
        return <Badge text="Video Call" variant="info" />;
      case 'phone_call':
        return <Badge text="Phone Call" variant="success" />;
      case 'in_person':
        return <Badge text="In Person" variant="warning" />;
      case 'chat':
        return <Badge text="Chat" variant="default" />;
      default:
        return <Badge text={type} variant="default" />;
    }
  };

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingStarsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Button key={star} title="★" onPress={() => setRating(star)} />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading session details..." />;
  }

  if (!session) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>Session Not Found</Text>
        <Text style={styles.notFoundText}>
          The session you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Session Header */}
        <Card>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Session Details</Text>
            {getStatusBadge(session.status)}
          </View>

          <View style={styles.typeRow}>
            {getSessionTypeBadge(session.session_type)}
            <Text style={styles.durationText}>
              {session.session_duration_minutes
                ? `${session.session_duration_minutes} min`
                : 'Duration TBD'}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Scheduled Date</Text>
              <Text style={styles.detailValue}>
                {session.scheduled_at
                  ? new Date(session.scheduled_at).toLocaleString()
                  : 'TBD'}
              </Text>
            </View>

            {session.completed_at && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>✅ Completed</Text>
                <Text style={styles.detailValue}>
                  {new Date(session.completed_at).toLocaleString()}
                </Text>
              </View>
            )}

            {session.session_rating && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⭐ Rating</Text>
                <Text style={styles.detailValue}>
                  {session.session_rating}/5 stars
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Session Notes */}
        {session.notes && (
          <Card title="Session Notes">
            <Text style={styles.notesText}>{session.notes}</Text>
          </Card>
        )}

        {/* Mentor Notes */}
        {session.mentor_notes && (
          <Card title="Mentor Notes">
            <Text style={styles.notesText}>{session.mentor_notes}</Text>
          </Card>
        )}

        {/* Session Feedback */}
        {session.session_feedback && (
          <Card title="Your Feedback">
            <Text style={styles.notesText}>{session.session_feedback}</Text>
          </Card>
        )}

        {/* Actions */}
        <Card title="Actions">
          {session.status.toLowerCase() === 'scheduled' && (
            <Button
              title="Cancel Session"
              onPress={handleCancelSession}
              variant="outline"
            />
          )}

          {session.status.toLowerCase() === 'completed' &&
            !session.session_rating && (
              <View>
                <Text style={styles.ratingLabel}>Rate Your Session</Text>

                {renderRatingStars()}

                <Text style={styles.feedbackLabel}>
                  Additional Feedback (Optional)
                </Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your experience..."
                  placeholderTextColor={colors.inputPlaceholder}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={feedback}
                  onChangeText={setFeedback}
                />

                <Button
                  title="Submit Rating"
                  onPress={handleRateSession}
                  loading={isRating}
                  disabled={isRating}
                />
              </View>
            )}

          {session.status.toLowerCase() === 'completed' &&
            session.session_rating && (
              <View style={styles.ratedBox}>
                <Text style={styles.ratedTitle}>✓ Session Rated</Text>
                <Text style={styles.ratedText}>
                  Thank you for your feedback!
                </Text>
              </View>
            )}
        </Card>
      </View>
    </ScrollView>
  );
}
