import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import type { OnboardingState } from '../../types';

interface OnboardingScreenProps {
  navigation: any;
}

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
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
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [resumeFileName, setResumeFileName] = useState('');

  const { updateUserProfile } = useAuthStore();

  // Load onboarding state on component mount
  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const state = await userApi.getOnboardingState();
      setOnboardingState(state);

      // If user has completed onboarding, redirect to dashboard
      if (state.is_completed) {
        navigation.navigate('Dashboard');
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
  };

  const validateStep1 = () => {
    const newErrors: any = {};

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
    const newErrors: any = {};

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
        setResumeFile(file);
        setResumeFileName(file.name);
        setErrors({ ...errors, resume: undefined });
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to select resume file');
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!resumeFile) {
      setErrors({ resume: 'Please upload your resume' });
      return;
    }

    setIsLoading(true);
    try {
      // Upload resume first
      const resumeResponse = await userApi.uploadResume(
        resumeFile.uri,
        resumeFileName
      );

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

      await userApi.updateProfile(profileData);
      updateUserProfile(profileData);

      // Mark onboarding as completed
      await userApi.completeOnboarding();

      Alert.alert('Welcome!', 'Your profile has been completed successfully.', [
        {
          text: 'Get Started',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]);
    } catch (error: any) {
      console.log('Onboarding error:', error);
      Alert.alert('Error', error.message || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center mb-6">
      {[1, 2, 3].map(stepNumber => (
        <View
          key={stepNumber}
          className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
            stepNumber <= step ? 'bg-primary-600' : 'bg-gray-300'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              stepNumber <= step ? 'text-white' : 'text-gray-600'
            }`}
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

      <Input
        label="Date of Birth *"
        placeholder="YYYY-MM-DD"
        value={dateOfBirth}
        onChangeText={text => {
          setDateOfBirth(text);
          if (errors.dateOfBirth)
            setErrors({ ...errors, dateOfBirth: undefined });
        }}
        error={errors.dateOfBirth}
      />

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
      <Text className="text-gray-700 mb-4">
        Upload your resume to complete your profile. This will be used for job
        applications.
      </Text>

      {resumeFile ? (
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <Text className="text-green-800 font-semibold mb-1">
            ✓ Resume Uploaded
          </Text>
          <Text className="text-green-700 text-sm">{resumeFileName}</Text>
        </View>
      ) : (
        <View className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
          <Text className="text-gray-500 text-center mb-2">
            📄 No resume selected
          </Text>
          <Text className="text-gray-400 text-sm text-center">
            Tap the button below to select your resume
          </Text>
        </View>
      )}

      <Button
        title={resumeFile ? 'Change Resume' : 'Select Resume'}
        onPress={handleResumeUpload}
        variant="outline"
        className="mb-4"
      />

      {errors.resume && (
        <Text className="text-red-500 text-sm mb-4">{errors.resume}</Text>
      )}

      <Text className="text-gray-500 text-xs">
        Supported formats: PDF, DOC, DOCX (Max 10MB)
      </Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 pt-12">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </Text>
            <Text className="text-gray-600 text-base">
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
          <View className="flex-row gap-3 mt-6">
            {step > 1 && (
              <View className="flex-1">
                <Button
                  title="Previous"
                  onPress={handlePrevious}
                  variant="outline"
                  disabled={isLoading}
                />
              </View>
            )}

            <View className={step > 1 ? 'flex-1' : 'flex-1'}>
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
            onPress={() => navigation.navigate('Dashboard')}
            className="mt-4"
          >
            <Text className="text-center text-gray-500 text-sm">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
