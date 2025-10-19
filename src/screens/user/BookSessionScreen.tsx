import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useMentorshipStore } from '../../stores/mentorshipStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import SessionTypeIcon from '../../components/SessionTypeIcon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';
import type { NavigationProp } from '../../types';

interface RouteParams {
  serviceType: string;
  serviceTitle: string;
  price: number;
  duration: number;
}

export default function BookSessionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { colors } = useTheme();
  const { mentors, fetchMentors, bookSession, isLoading } =
    useMentorshipStore();
  const { showAlert, hideAlert, alertState } = useModernAlert();

  const params = route.params as RouteParams;
  const { serviceType, serviceTitle, price, duration } = params;

  const [selectedMentor, setSelectedMentor] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMentors({ page: 1, pageSize: 50 });
  }, [fetchMentors]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      padding: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    serviceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    serviceName: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    priceInfo: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      padding: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    required: {
      color: colors.error,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      maxHeight: 200,
    },
    mentorOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    mentorOptionSelected: {
      backgroundColor: `${colors.primary}10`,
    },
    mentorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    mentorAvatarText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
    },
    mentorInfo: {
      flex: 1,
    },
    mentorName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    mentorDomain: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    dateButton: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      backgroundColor: colors.inputBackground,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    dateButtonIcon: {
      fontSize: 20,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      backgroundColor: colors.inputBackground,
      minHeight: 100,
      color: colors.text,
    },
    bookButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    bookButtonDisabled: {
      backgroundColor: colors.textTertiary,
    },
    bookButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    helpText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });

  const handleBookSession = async () => {
    if (date <= new Date()) {
      showAlert(
        'Invalid Date',
        'Please select a future date and time',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]
      );
      return;
    }

    try {
      setSubmitting(true);

      await bookSession({
        mentor_id: selectedMentor || undefined, // Allow empty for auto-assignment
        session_type: serviceType,
        scheduled_at: date.toISOString(),
        notes: notes || undefined,
      });

      showAlert(
        'Success',
        'Your mentorship session has been booked successfully!',
        [
          {
            text: 'View My Sessions',
            onPress: () => {
              navigation.navigate('MySessions');
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      showAlert(
        'Error',
        err instanceof Error
          ? err.message
          : 'Failed to book session. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && mentors.length === 0) {
    return <LoadingSpinner message="Loading mentors..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Mentorship Session</Text>
        <View style={styles.serviceInfo}>
          <SessionTypeIcon type={serviceType} size={20} />
          <Text style={styles.serviceName}>{serviceTitle}</Text>
        </View>
        <Text style={styles.priceInfo}>
          ₹{price.toLocaleString()} | {duration} minutes
        </Text>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>
          Select Mentor (Optional)
        </Text>
        <Text style={styles.helpText}>
          Choose a specific mentor or let our system auto-assign the best match
        </Text>

        <ScrollView style={styles.pickerContainer} nestedScrollEnabled>
          <TouchableOpacity
            style={[
              styles.mentorOption,
              !selectedMentor && styles.mentorOptionSelected,
            ]}
            onPress={() => setSelectedMentor('')}
          >
            <View style={styles.mentorAvatar}>
              <Text style={styles.mentorAvatarText}>?</Text>
            </View>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>Auto-assign Mentor</Text>
              <Text style={styles.mentorDomain}>
                Let us match you with the best mentor
              </Text>
            </View>
          </TouchableOpacity>

          {mentors.map(mentor => (
            <TouchableOpacity
              key={mentor.mentor_id}
              style={[
                styles.mentorOption,
                selectedMentor === mentor.mentor_id &&
                  styles.mentorOptionSelected,
              ]}
              onPress={() => setSelectedMentor(mentor.mentor_id)}
            >
              <View style={styles.mentorAvatar}>
                <Text style={styles.mentorAvatarText}>
                  {mentor.user?.first_name?.[0] || 'M'}
                </Text>
              </View>
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>
                  {mentor.user?.first_name && mentor.user?.last_name 
                    ? `${mentor.user.first_name} ${mentor.user.last_name}`
                    : 'Unknown Mentor'
                  }
                </Text>
                <Text style={styles.mentorDomain}>
                  {mentor.domain} • {mentor.experience_years}+ years
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>
          Preferred Date <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
          <Text style={styles.dateButtonIcon}>📅</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event: any, selectedDate?: Date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>
          Preferred Time <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatTime(date)}</Text>
          <Text style={styles.dateButtonIcon}>🕐</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event: any, selectedDate?: Date) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Session Notes (Optional)</Text>
        <Text style={styles.helpText}>
          Add any specific topics or questions you'd like to discuss
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g., Focus on ATS optimization, behavioral questions, etc."
          placeholderTextColor={colors.inputPlaceholder}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.bookButton,
            submitting && styles.bookButtonDisabled,
          ]}
          onPress={handleBookSession}
          disabled={submitting}
        >
          <Text style={styles.bookButtonText}>
            {submitting ? 'Booking...' : `Book Session - ₹${price.toLocaleString()}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
      <ModernAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </View>
  );
}

