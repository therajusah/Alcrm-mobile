import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { MentorshipSession } from '../../types';

interface MentorshipSessionDetailScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}

export default function MentorshipSessionDetailScreen({
  route,
  navigation,
}: MentorshipSessionDetailScreenProps) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<MentorshipSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const loadSessionDetail = useCallback(async () => {
    try {
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
      <View className="flex-row mb-4">
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
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Session Not Found
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          The session you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-6 py-6">
        {/* Session Header */}
        <Card>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">
              Session Details
            </Text>
            {getStatusBadge(session.status)}
          </View>

          <View className="flex-row items-center gap-2 mb-4">
            {getSessionTypeBadge(session.session_type)}
            <Text className="text-gray-600">
              {session.session_duration_minutes
                ? `${session.session_duration_minutes} min`
                : 'Duration TBD'}
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">
                📅 Scheduled Date
              </Text>
              <Text className="text-gray-900 font-semibold">
                {session.scheduled_at
                  ? new Date(session.scheduled_at).toLocaleString()
                  : 'TBD'}
              </Text>
            </View>

            {session.completed_at && (
              <View className="mb-3">
                <Text className="text-gray-600 text-sm mb-1">✅ Completed</Text>
                <Text className="text-gray-900 font-semibold">
                  {new Date(session.completed_at).toLocaleString()}
                </Text>
              </View>
            )}

            {session.session_rating && (
              <View className="mb-3">
                <Text className="text-gray-600 text-sm mb-1">⭐ Rating</Text>
                <Text className="text-gray-900 font-semibold">
                  {session.session_rating}/5 stars
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Session Notes */}
        {session.notes && (
          <Card title="Session Notes">
            <Text className="text-gray-700 leading-6">{session.notes}</Text>
          </Card>
        )}

        {/* Mentor Notes */}
        {session.mentor_notes && (
          <Card title="Mentor Notes">
            <Text className="text-gray-700 leading-6">
              {session.mentor_notes}
            </Text>
          </Card>
        )}

        {/* Session Feedback */}
        {session.session_feedback && (
          <Card title="Your Feedback">
            <Text className="text-gray-700 leading-6">
              {session.session_feedback}
            </Text>
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
                <Text className="text-gray-700 font-semibold mb-3">
                  Rate Your Session
                </Text>

                {renderRatingStars()}

                <Text className="text-gray-700 font-semibold mb-2">
                  Additional Feedback (Optional)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-4 mb-4 text-gray-900 bg-white min-h-[100px]"
                  placeholder="Share your experience..."
                  placeholderTextColor="#9CA3AF"
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
              <View className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Text className="text-green-800 font-semibold mb-1">
                  ✓ Session Rated
                </Text>
                <Text className="text-green-700 text-sm">
                  Thank you for your feedback!
                </Text>
              </View>
            )}
        </Card>
      </View>
    </ScrollView>
  );
}
