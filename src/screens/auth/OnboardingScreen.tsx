import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import type { OnboardingState } from '../../types';
import { NavigationProp } from '../../types';

interface OnboardingScreenProps {
  navigation: NavigationProp;
}

interface ResumeFile {
  uri: string;
  name: string;
  size?: number;
  type?: string;
}

interface OnboardingErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  whatsappNumber?: string;
  bio?: string;
  qualification?: string;
  baseLocation?: string;
  currentLocation?: string;
  resume?: string;
}

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [, setOnboardingState] = useState<OnboardingState | null>(null);

  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Professional Information
  const [bio, setBio] = useState('');
  const [qualification, setQualification] = useState('');
  const [baseLocation, setBaseLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  // Resume
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));

  const { updateUserProfile } = useAuthStore();

  const loadOnboardingState = useCallback(async () => {
    try {
      const state = await userApi.getOnboardingState();
      setOnboardingState(state);

      // If user has completed onboarding, redirect to main app
      if (state.is_completed) {
        navigation.navigate('UserTabs' as never);
        return;
      }

      // Set current step from server state
      if (state.current_step > 1) {
        setStep(state.current_step);
      }
    } catch (error) {
      console.log('Failed to load onboarding state:', error);
      // Continue with default step 1 if API fails
    }
  }, [navigation]);

  // Load onboarding state on component mount
  useEffect(() => {
    loadOnboardingState();
  }, [loadOnboardingState]);

  const validateStep1 = () => {
    const newErrors: OnboardingErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: OnboardingErrors = {};

    if (!qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    }

    if (!baseLocation.trim()) {
      newErrors.baseLocation = 'Base location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      const nextStep = 2;
      setStep(nextStep);
      // Save step progress to server
      try {
        await userApi.setOnboardingStep(nextStep);
      } catch (error) {
        console.log('Failed to save step progress:', error);
      }
    } else if (step === 2 && validateStep2()) {
      const nextStep = 3;
      setStep(nextStep);
      // Save step progress to server
      try {
        await userApi.setOnboardingStep(nextStep);
      } catch (error) {
        console.log('Failed to save step progress:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size && file.size > maxSize) {
          Alert.alert(
            'File Too Large',
            'Please select a resume file smaller than 10MB'
          );
          return;
        }

        setResumeFile(file);
        setResumeFileName(file.name);
        setErrors({ ...errors, resume: undefined });
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to select resume file');
    }
  };

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    // Validate date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // Check if future date
    if (selectedDateOnly > today) {
      setErrors({
        ...errors,
        dateOfBirth: 'Date of birth cannot be in the future',
      });
      return;
    }

    // Calculate age
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    // Check minimum age (13)
    if (actualAge < 13) {
      setErrors({
        ...errors,
        dateOfBirth: 'You must be at least 13 years old',
      });
      return;
    }

    // Check maximum age (120)
    if (actualAge > 120) {
      setErrors({
        ...errors,
        dateOfBirth: 'Please enter a valid date of birth',
      });
      return;
    }

    setSelectedDate(date);
    const formattedDate = formatLocalDate(date);
    setDateOfBirth(formattedDate);
    if (errors.dateOfBirth) {
      setErrors({ ...errors, dateOfBirth: undefined });
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select your date of birth';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Select your date of birth';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCompleteOnboarding = async () => {
    if (!resumeFile) {
      setErrors({ resume: 'Please upload your resume' });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Uploading resume:', resumeFileName);
      // Upload resume first
      const resumeResponse = await userApi.uploadResume(
        resumeFile.uri,
        resumeFileName
      );
      console.log('Resume uploaded successfully:', resumeResponse);

      // Update user profile with all information
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone,
        whatsapp_number: whatsappNumber || phone,
        bio,
        qualification,
        base_location: baseLocation,
        current_location: currentLocation || baseLocation,
        resume_url: resumeResponse.resume_url,
      };

      console.log('Updating profile with data');
      await userApi.updateProfile(profileData);
      updateUserProfile(profileData);

      // Mark onboarding as completed
      console.log('Marking onboarding as completed');
      await userApi.completeOnboarding();

      Alert.alert('Welcome!', 'Your profile has been completed successfully.', [
        {
          text: 'Get Started',
          onPress: () => navigation.navigate('UserTabs' as never),
        },
      ]);
    } catch (error: unknown) {
      console.error('Onboarding error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to complete onboarding. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map(stepNumber => (
        <View
          key={stepNumber}
          style={[
            styles.stepCircle,
            stepNumber <= step ? styles.stepActive : styles.stepInactive,
          ]}
        >
          <Text
            style={[
              styles.stepText,
              stepNumber <= step
                ? styles.stepTextActive
                : styles.stepTextInactive,
            ]}
          >
            {stepNumber}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <Card title="Personal Information">
      <Input
        label="First Name *"
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={text => {
          setFirstName(text);
          if (errors.firstName) setErrors({ ...errors, firstName: undefined });
        }}
        error={errors.firstName}
      />

      <Input
        label="Last Name *"
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={text => {
          setLastName(text);
          if (errors.lastName) setErrors({ ...errors, lastName: undefined });
        }}
        error={errors.lastName}
      />

      <View style={{ marginBottom: 16 }}>
        <Text style={datePickerStyles.label}>Date of Birth *</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            datePickerStyles.dateButton,
            errors.dateOfBirth && datePickerStyles.dateButtonError,
          ]}
        >
          <Text
            style={[
              datePickerStyles.dateButtonText,
              !dateOfBirth && datePickerStyles.dateButtonPlaceholder,
            ]}
          >
            {formatDisplayDate(dateOfBirth)}
          </Text>
          <Text style={datePickerStyles.dateIcon}>📅</Text>
        </TouchableOpacity>
        {errors.dateOfBirth && (
          <Text style={datePickerStyles.errorText}>{errors.dateOfBirth}</Text>
        )}
      </View>

      <Input
        label="Phone Number *"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={text => {
          setPhone(text);
          if (errors.phone) setErrors({ ...errors, phone: undefined });
        }}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <Input
        label="WhatsApp Number"
        placeholder="Enter WhatsApp number (optional)"
        value={whatsappNumber}
        onChangeText={text => {
          setWhatsappNumber(text);
        }}
        keyboardType="phone-pad"
      />
    </Card>
  );

  const renderStep2 = () => (
    <Card title="Professional Information">
      <Input
        label="Qualification *"
        placeholder="e.g., B.Tech Computer Science"
        value={qualification}
        onChangeText={text => {
          setQualification(text);
          if (errors.qualification)
            setErrors({ ...errors, qualification: undefined });
        }}
        error={errors.qualification}
      />

      <Input
        label="Base Location *"
        placeholder="e.g., Mumbai, India"
        value={baseLocation}
        onChangeText={text => {
          setBaseLocation(text);
          if (errors.baseLocation)
            setErrors({ ...errors, baseLocation: undefined });
        }}
        error={errors.baseLocation}
      />

      <Input
        label="Current Location"
        placeholder="e.g., Bangalore, India"
        value={currentLocation}
        onChangeText={text => {
          setCurrentLocation(text);
        }}
      />

      <Input
        label="Bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChangeText={text => {
          setBio(text);
        }}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </Card>
  );

  const renderStep3 = () => (
    <Card title="Upload Resume">
      <Text style={styles.resumeDescription}>
        Upload your resume to complete your profile. This will be used for job
        applications.
      </Text>

      {resumeFile ? (
        <View style={styles.resumeUploadedContainer}>
          <Text style={styles.resumeUploadedTitle}>✓ Resume Uploaded</Text>
          <Text style={styles.resumeUploadedText}>{resumeFileName}</Text>
        </View>
      ) : (
        <View style={styles.resumeEmptyContainer}>
          <Text style={styles.resumeEmptyIcon}>📄</Text>
          <Text style={styles.resumeEmptyText}>
            No resume selected. Tap the button below to upload your resume.
          </Text>
        </View>
      )}

      <Button
        title={resumeFile ? 'Change Resume' : 'Select Resume'}
        onPress={handleResumeUpload}
        variant="outline"
      />

      {errors.resume && <Text style={styles.errorText}>{errors.resume}</Text>}

      <Text style={styles.supportedFormats}>
        Supported formats: PDF, DOC, DOCX (Max 10MB)
      </Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Step {step} of 3:{' '}
              {step === 1
                ? 'Personal Info'
                : step === 2
                  ? 'Professional Info'
                  : 'Resume Upload'}
            </Text>
          </View>

          {renderStepIndicator()}

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            {step > 1 && (
              <View style={styles.buttonFlex}>
                <Button
                  title="Previous"
                  onPress={handlePrevious}
                  variant="outline"
                  disabled={isLoading}
                />
              </View>
            )}

            <View style={styles.buttonFlex}>
              {step < 3 ? (
                <Button
                  title="Next"
                  onPress={handleNext}
                  disabled={isLoading}
                />
              ) : (
                <Button
                  title="Complete Profile"
                  onPress={handleCompleteOnboarding}
                  loading={isLoading}
                />
              )}
            </View>
          </View>

          {/* Skip Option */}
          <TouchableOpacity
            onPress={() => navigation.navigate('UserTabs' as never)}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>
              Skip for now (Complete later in Profile)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={datePickerStyles.modalOverlay}>
          <View style={datePickerStyles.modalContent}>
            <View style={datePickerStyles.modalHeader}>
              <Text style={datePickerStyles.modalTitle}>
                Select Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={datePickerStyles.closeButton}
              >
                <Text style={datePickerStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={datePickerStyles.pickerContainer}>
              <View style={datePickerStyles.pickerColumn}>
                <Text style={datePickerStyles.pickerLabel}>Year</Text>
                <ScrollView
                  style={datePickerStyles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map(year => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(year);
                        // Clamp day to valid range for new year/month combination
                        const maxDay = new Date(
                          year,
                          selectedDate.getMonth() + 1,
                          0
                        ).getDate();
                        if (newDate.getDate() > maxDay) {
                          newDate.setDate(maxDay);
                        }
                        setSelectedDate(newDate);
                      }}
                      style={[
                        datePickerStyles.pickerItem,
                        selectedDate.getFullYear() === year &&
                          datePickerStyles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          datePickerStyles.pickerItemText,
                          selectedDate.getFullYear() === year &&
                            datePickerStyles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={datePickerStyles.pickerColumn}>
                <Text style={datePickerStyles.pickerLabel}>Month</Text>
                <ScrollView
                  style={datePickerStyles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {[
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ].map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(index);
                        // Clamp day to valid range for new month
                        const maxDay = new Date(
                          newDate.getFullYear(),
                          index + 1,
                          0
                        ).getDate();
                        if (newDate.getDate() > maxDay) {
                          newDate.setDate(maxDay);
                        }
                        setSelectedDate(newDate);
                      }}
                      style={[
                        datePickerStyles.pickerItem,
                        selectedDate.getMonth() === index &&
                          datePickerStyles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          datePickerStyles.pickerItemText,
                          selectedDate.getMonth() === index &&
                            datePickerStyles.pickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={datePickerStyles.pickerColumn}>
                <Text style={datePickerStyles.pickerLabel}>Day</Text>
                <ScrollView
                  style={datePickerStyles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {(() => {
                    const maxDay = new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() + 1,
                      0
                    ).getDate();
                    return Array.from({ length: maxDay }, (_, i) => i + 1).map(
                      day => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(day);
                            setSelectedDate(newDate);
                          }}
                          style={[
                            datePickerStyles.pickerItem,
                            selectedDate.getDate() === day &&
                              datePickerStyles.pickerItemSelected,
                          ]}
                        >
                          <Text
                            style={[
                              datePickerStyles.pickerItemText,
                              selectedDate.getDate() === day &&
                                datePickerStyles.pickerItemTextSelected,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      )
                    );
                  })()}
                </ScrollView>
              </View>
            </View>

            <View style={datePickerStyles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={[
                  datePickerStyles.actionButton,
                  datePickerStyles.cancelButton,
                ]}
              >
                <Text style={datePickerStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDateSelect(selectedDate);
                  setShowDatePicker(false);
                }}
                style={[
                  datePickerStyles.actionButton,
                  datePickerStyles.confirmButton,
                ]}
              >
                <Text style={datePickerStyles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stepActive: {
    backgroundColor: '#2563EB',
  },
  stepInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepTextInactive: {
    color: '#9CA3AF',
  },
  resumeDescription: {
    color: '#6B7280',
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
  },
  resumeUploadedContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  resumeUploadedTitle: {
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 16,
  },
  resumeUploadedText: {
    color: '#047857',
    fontSize: 14,
  },
  resumeEmptyContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 32,
    marginBottom: 20,
    alignItems: 'center',
  },
  resumeEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  resumeEmptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  supportedFormats: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  buttonFlex: {
    flex: 1,
  },
  skipButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
  skipText: {
    textAlign: 'center',
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

const datePickerStyles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonError: {
    borderColor: '#EF4444',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  dateButtonPlaceholder: {
    color: '#9CA3AF',
  },
  dateIcon: {
    fontSize: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  picker: {
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#374151',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
