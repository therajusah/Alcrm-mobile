import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { UserProfile } from '../../types';

export default function ProfileScreen({ navigation }: any) {
  const { user, updateUserProfile } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [baseLocation, setBaseLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);

      // Set form fields
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPhone(data.phone || '');
      setBio(data.bio || '');
      setBaseLocation(data.base_location || '');
      setCurrentLocation(data.current_location || '');
      setQualification(data.qualification || '');
      setWhatsappNumber(data.whatsapp_number || '');
    } catch {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        first_name: firstName,
        last_name: lastName,
        phone,
        bio,
        base_location: baseLocation,
        current_location: currentLocation,
        qualification,
        whatsapp_number: whatsappNumber,
      };

      await userApi.updateProfile(updates);
      updateUserProfile(updates);

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      await loadProfile();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form fields
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setBaseLocation(profile.base_location || '');
      setCurrentLocation(profile.current_location || '');
      setQualification(profile.qualification || '');
      setWhatsappNumber(profile.whatsapp_number || '');
    }
    setIsEditing(false);
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
        setIsUploadingResume(true);

        try {
          const response = await userApi.uploadResume(file.uri, file.name);

          // Update profile with new resume URL
          const updates = { resume_url: response.resume_url };
          await userApi.updateProfile(updates);
          updateUserProfile(updates);

          Alert.alert('Success', 'Resume uploaded successfully');
          await loadProfile();
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to upload resume');
        } finally {
          setIsUploadingResume(false);
        }
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to select resume file');
    }
  };

  const handleResumeDelete = async () => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete your resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.deleteResume();

              // Update profile to remove resume URL
              const updates = { resume_url: undefined };
              await userApi.updateProfile(updates);
              updateUserProfile(updates);

              Alert.alert('Success', 'Resume deleted successfully');
              await loadProfile();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete resume');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-6 py-6">
        {/* Profile Header */}
        <Card>
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl text-primary-600 font-bold">
                {(firstName || user?.email)?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {firstName && lastName
                ? `${firstName} ${lastName}`
                : 'Complete your profile'}
            </Text>
            <Text className="text-gray-600 mt-1">{user?.email}</Text>
          </View>

          {!isEditing && (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="outline"
            />
          )}
        </Card>

        {/* Profile Form */}
        <Card title="Personal Information">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            editable={isEditing}
          />

          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            editable={isEditing}
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <Input
            label="WhatsApp Number"
            placeholder="Enter your WhatsApp number"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
            <Input
              placeholder="Tell us about yourself"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              editable={isEditing}
              containerClassName="mb-0"
            />
          </View>

          <Input
            label="Qualification"
            placeholder="Your highest qualification"
            value={qualification}
            onChangeText={setQualification}
            editable={isEditing}
          />

          <Input
            label="Base Location"
            placeholder="Your home location"
            value={baseLocation}
            onChangeText={setBaseLocation}
            editable={isEditing}
          />

          <Input
            label="Current Location"
            placeholder="Where you currently live"
            value={currentLocation}
            onChangeText={setCurrentLocation}
            editable={isEditing}
            containerClassName="mb-0"
          />

          {isEditing && (
            <View className="flex-row gap-3 mt-6">
              <View className="flex-1">
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                />
              </View>
              <View className="flex-1">
                <Button title="Save" onPress={handleSave} loading={isSaving} />
              </View>
            </View>
          )}
        </Card>

        {/* Resume Section */}
        <Card title="Resume">
          {profile?.resume_url ? (
            <View>
              <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <Text className="text-green-800 font-semibold mb-1">
                  ✓ Resume Uploaded
                </Text>
                <Text className="text-green-700 text-sm">
                  Your resume is ready for job applications
                </Text>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button
                    title="Update Resume"
                    onPress={handleResumeUpload}
                    variant="outline"
                    loading={isUploadingResume}
                    disabled={isUploadingResume}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Delete Resume"
                    onPress={handleResumeDelete}
                    variant="outline"
                    className="border-red-300"
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <Text className="text-gray-500 text-center mb-2">
                  📄 No resume uploaded
                </Text>
                <Text className="text-gray-400 text-sm text-center">
                  Upload your resume to apply for jobs
                </Text>
              </View>

              <Button
                title="Upload Resume"
                onPress={handleResumeUpload}
                loading={isUploadingResume}
                disabled={isUploadingResume}
              />
            </View>
          )}

          <Text className="text-gray-500 text-xs mt-3">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </Text>
        </Card>

        {/* Account Actions */}
        <Card title="Account">
          <Button
            title="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
            variant="outline"
            className="mb-3"
          />

          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            variant="outline"
          />
        </Card>
      </View>
    </ScrollView>
  );
}
