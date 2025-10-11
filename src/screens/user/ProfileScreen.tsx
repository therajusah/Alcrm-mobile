import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { UserProfile } from '../../types';
import { NavigationProp } from '../../types';

interface ProfileScreenProps {
  navigation: NavigationProp;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, updateUserProfile } = useAuthStore();
  const { isDark, setThemeMode, themeMode } = useTheme();
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

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 16,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      color: colors.textInverse,
      fontSize: 24,
      fontWeight: 'bold',
    },
    themeToggle: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 12,
      borderRadius: 20,
    },
    themeIcon: {
      color: colors.textInverse,
      fontSize: 20,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 96,
      height: 96,
      backgroundColor: colors.primary + '20',
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 36,
      color: colors.primary,
      fontWeight: 'bold',
    },
    nameText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    emailText: {
      color: colors.textSecondary,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    resumeInfo: {
      marginBottom: 12,
    },
    resumeLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    resumeText: {
      color: colors.text,
      fontWeight: '600',
    },
  });

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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      Alert.alert('Error', errorMessage);
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
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to upload resume';
          Alert.alert('Error', errorMessage);
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
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to delete resume';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleThemeToggle = () => {
    if (themeMode === 'system') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else {
      setThemeMode(isDark ? 'light' : 'dark');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with Dark Mode Toggle */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={handleThemeToggle}
            style={styles.themeToggle}
          >
            <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Header */}
        <Card>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(firstName || user?.email)?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.nameText}>
              {firstName && lastName
                ? `${firstName} ${lastName}`
                : 'Complete your profile'}
            </Text>
            <Text style={styles.emailText}>{user?.email}</Text>
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

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
              Bio
            </Text>
            <Input
              placeholder="Tell us about yourself"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              editable={isEditing}
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
          />

          {isEditing && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Save" onPress={handleSave} loading={isSaving} />
              </View>
            </View>
          )}
        </Card>

        {/* Resume Section */}
        <Card title="Resume">
          {profile?.resume_url ? (
            <View>
              <View style={{
                backgroundColor: colors.success + '20',
                borderWidth: 1,
                borderColor: colors.success + '40',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}>
                <Text style={{
                  color: colors.success,
                  fontWeight: '600',
                  marginBottom: 4,
                }}>
                  ✓ Resume Uploaded
                </Text>
                <Text style={{
                  color: colors.success,
                  fontSize: 14,
                }}>
                  Your resume is ready for job applications
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Update Resume"
                    onPress={handleResumeUpload}
                    variant="outline"
                    loading={isUploadingResume}
                    disabled={isUploadingResume}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Delete Resume"
                    onPress={handleResumeDelete}
                    variant="outline"
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={{
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colors.border,
                borderRadius: 8,
                padding: 24,
                marginBottom: 16,
              }}>
                <Text style={{
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                  📄 No resume uploaded
                </Text>
                <Text style={{
                  color: colors.textTertiary,
                  fontSize: 14,
                  textAlign: 'center',
                }}>
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

          <Text style={{
            color: colors.textSecondary,
            fontSize: 12,
            marginTop: 12,
          }}>
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </Text>
        </Card>

        {/* Account Actions */}
        <Card title="Account">
          <Button
            title="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
            variant="outline"
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
