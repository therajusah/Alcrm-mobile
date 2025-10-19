import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { useMentorshipStore } from '../../stores/mentorshipStore';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';

// Optional: Import DateTimePicker only if available
let DateTimePicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  console.log('@react-native-community/datetimepicker not available');
}

interface MentorDetailScreenProps {
  route?: {
    params?: {
      mentorId?: string;
    };
  };
  navigation?: {
    navigate?: (screen: string, params?: any) => void;
    goBack?: () => void;
  };
}

export default function MentorDetailScreen({
  route,
  navigation,
}: MentorDetailScreenProps) {
  const { mentorId } = route?.params || { mentorId: '' };
  const { selectedMentor, fetchMentorDetail, bookSession, isLoading } =
    useMentorshipStore();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [bookingData, setBookingData] = useState({
    session_type: 'video_call',
    scheduled_at: '',
    notes: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    mentorHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    mentorAvatar: {
      width: 100,
      height: 100,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    mentorAvatarText: {
      fontSize: 36,
      color: colors.primary,
      fontWeight: 'bold',
    },
    mentorName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    mentorTitle: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 8,
    },
    mentorRating: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    mentorStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    bioText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
    domainsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    bookingButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    bookingButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 16,
      marginBottom: 16,
    },
    sessionTypeContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    sessionTypeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    sessionTypeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sessionTypeText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    sessionTypeTextActive: {
      color: colors.textInverse,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
  });

  const loadMentorDetail = useCallback(async () => {
    if (mentorId) {
      await fetchMentorDetail(mentorId);
    }
  }, [fetchMentorDetail, mentorId]);

  useEffect(() => {
    if (!mentorId) {
      Alert.alert('Error', 'Mentor ID not found', [
        { text: 'OK', onPress: () => navigation?.goBack?.() }
      ]);
      return;
    }
    loadMentorDetail();
  }, [loadMentorDetail, mentorId, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMentorDetail();
    setRefreshing(false);
  };

  const handleBookSession = () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    if (!mentorId) {
      Alert.alert('Error', 'Mentor ID not found');
      return;
    }

    if (!bookingData.scheduled_at) {
      Alert.alert('Required', 'Please select a date and time');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book a ${bookingData.session_type.replace('_', ' ')} session with ${selectedMentor?.user?.first_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: async () => {
            try {
              await bookSession({
                mentor_id: mentorId,
                user_id: user.id,
                session_type: bookingData.session_type,
                scheduled_at: bookingData.scheduled_at,
                notes: bookingData.notes,
              });
              setShowBookingModal(false);
              Alert.alert('Success', 'Session booked successfully!');
              navigation?.navigate?.('MySessions');
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to book session';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  if (isLoading && !selectedMentor) {
    return <LoadingSpinner message="Loading mentor details..." />;
  }

  if (!selectedMentor) {
    return (
      <View style={styles.container}>
        <Text
          style={{ color: colors.text, textAlign: 'center', marginTop: 50 }}
        >
          Mentor not found
        </Text>
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
        {/* Mentor Header */}
        <View style={styles.mentorHeader}>
          <View style={styles.mentorAvatar}>
            <Text style={styles.mentorAvatarText}>
              {selectedMentor.user?.first_name?.[0] || 'M'}
            </Text>
          </View>
          <Text style={styles.mentorName}>
            {selectedMentor.user?.first_name} {selectedMentor.user?.last_name}
          </Text>
          <Text style={styles.mentorTitle}>
            {selectedMentor.domain || 'Career Mentor'}
          </Text>
          <Text style={styles.mentorRating}>
            ⭐ {selectedMentor.rating || 4.5} • {selectedMentor.experience_years}+ years experience
          </Text>
        </View>

        {/* Stats */}
        <Card>
          <View style={styles.mentorStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedMentor.total_sessions || 0}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{selectedMentor.hourly_rate || 500}</Text>
              <Text style={styles.statLabel}>Per Hour</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedMentor.experience_years || 0}
              </Text>
              <Text style={styles.statLabel}>Years Exp</Text>
            </View>
          </View>
        </Card>

        {/* Bio */}
        {selectedMentor.bio && (
          <Card>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{selectedMentor.bio}</Text>
          </Card>
        )}

        {/* Expertise Domain */}
        <Card>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <View style={styles.domainsContainer}>
            <Badge text={selectedMentor.domain} variant="info" />
          </View>
        </Card>

        {/* Book Session Button */}
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => setShowBookingModal(true)}
        >
          <Text style={styles.bookingButtonText}>Book a Session</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book a Session</Text>

            <Text style={styles.inputLabel}>Session Type</Text>
            <View style={styles.sessionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.sessionTypeButton,
                  bookingData.session_type === 'video_call' &&
                    styles.sessionTypeButtonActive,
                ]}
                onPress={() =>
                  setBookingData({ ...bookingData, session_type: 'video_call' })
                }
              >
                <Text
                  style={[
                    styles.sessionTypeText,
                    bookingData.session_type === 'video_call' &&
                      styles.sessionTypeTextActive,
                  ]}
                >
                  Video Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sessionTypeButton,
                  bookingData.session_type === 'phone_call' &&
                    styles.sessionTypeButtonActive,
                ]}
                onPress={() =>
                  setBookingData({ ...bookingData, session_type: 'phone_call' })
                }
              >
                <Text
                  style={[
                    styles.sessionTypeText,
                    bookingData.session_type === 'phone_call' &&
                      styles.sessionTypeTextActive,
                  ]}
                >
                  Phone Call
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Date & Time</Text>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => setShowDateTimePicker(true)}
            >
              <Text style={{ color: bookingData.scheduled_at ? colors.text : colors.inputPlaceholder }}>
                {bookingData.scheduled_at
                  ? new Date(bookingData.scheduled_at).toLocaleString()
                  : 'Select date and time'}
              </Text>
            </TouchableOpacity>

            {showDateTimePicker && DateTimePicker && (
              <DateTimePicker
                value={selectedDateTime}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={(event: any, date?: Date) => {
                  setShowDateTimePicker(Platform.OS === 'ios');
                  if (date && event.type !== 'dismissed') {
                    setSelectedDateTime(date);
                    setBookingData({
                      ...bookingData,
                      scheduled_at: date.toISOString(),
                    });
                  }
                }}
              />
            )}

            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[
                styles.textInput,
                { height: 80, textAlignVertical: 'top' },
              ]}
              placeholder="Any specific topics you'd like to discuss?"
              placeholderTextColor={colors.inputPlaceholder}
              value={bookingData.notes}
              onChangeText={text =>
                setBookingData({ ...bookingData, notes: text })
              }
              multiline
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowBookingModal(false)}
                variant="outline"
              />
              <Button title="Book Session" onPress={handleBookSession} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
