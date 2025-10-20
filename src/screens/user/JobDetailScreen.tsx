import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NavigationProp, RootStackParamList } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { ShimmerScreen } from '../../components/Shimmer';

import { useJobStore } from '../../stores/jobStore';

type JobDetailScreenRouteProp = RouteProp<RootStackParamList, 'JobDetail'>;

interface ResumeFile {
  uri: string;
  name: string;
  size?: number;
  type?: string;
}

export default function JobDetailScreen() {
  const route = useRoute<JobDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { jobId } = route.params;
  const { selectedJob, fetchJobDetail, applyForJob, isLoading } = useJobStore();
  const { user } = useAuthStore();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      color: colors.error,
      fontSize: 18,
      marginBottom: 16,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    jobTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    companyName: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    detailsSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      marginTop: 8,
    },
    detailRow: {
      marginBottom: 12,
    },
    detailLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    detailValue: {
      color: colors.text,
      fontWeight: '600',
    },
    description: {
      color: colors.textSecondary,
      lineHeight: 24,
    },
    statusContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    statusMessage: {
      color: colors.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    coverLetterLabel: {
      color: colors.textSecondary,
      marginBottom: 12,
    },
    coverLetterInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      color: colors.text,
      backgroundColor: colors.surface,
      minHeight: 120,
    },
    resumeSection: {
      marginBottom: 16,
    },
    resumeSectionTitle: {
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: 8,
    },
    resumeProfileBox: {
      backgroundColor: `${colors.info}15`,
      borderWidth: 1,
      borderColor: `${colors.info}40`,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    resumeProfileTitle: {
      color: colors.info,
      fontWeight: '600',
      marginBottom: 4,
    },
    resumeProfileText: {
      color: colors.info,
      fontSize: 14,
    },
    resumeUploadedBox: {
      backgroundColor: `${colors.success}15`,
      borderWidth: 1,
      borderColor: `${colors.success}40`,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    resumeUploadedTitle: {
      color: colors.success,
      fontWeight: '600',
      marginBottom: 4,
    },
    resumeUploadedText: {
      color: colors.success,
      fontSize: 14,
    },
    resumeEmptyBox: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    resumeEmptyIcon: {
      color: colors.textTertiary,
      textAlign: 'center',
      marginBottom: 8,
    },
    resumeEmptyText: {
      color: colors.textTertiary,
      fontSize: 14,
      textAlign: 'center',
    },
    supportedFormats: {
      color: colors.textTertiary,
      fontSize: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    buttonFlex: {
      flex: 1,
    },
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetail(jobId);
    }

    return () => {
      // Clean up when leaving screen
    };
  }, [jobId, fetchJobDetail]);

  // Check if jobId is valid
  if (!jobId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid Job ID</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

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
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to select resume file');
    }
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      Alert.alert('Required', 'Please write a cover letter');
      return;
    }

    setApplying(true);
    try {
      let resumeUrl = user?.resume_url;

      // If user uploaded a new resume, upload it first
      if (resumeFile) {
        setIsUploadingResume(true);
        try {
          const response = await userApi.uploadResume(
            resumeFile.uri,
            resumeFileName
          );
          resumeUrl = response.resume_url;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          Alert.alert('Error', `Failed to upload resume: ${errorMessage}`);
          return;
        } finally {
          setIsUploadingResume(false);
        }
      }

      // Apply for job with cover letter and resume
      await applyForJob(jobId, coverLetter, resumeUrl);
      Alert.alert('Success', 'Application submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit application';
      Alert.alert('Error', errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case 'FULL-TIME':
        return <Badge text="Full-Time" variant="success" />;
      case 'PART-TIME':
        return <Badge text="Part-Time" variant="info" />;
      case 'CONTRACT':
        return <Badge text="Contract" variant="warning" />;
      case 'INTERNSHIP':
        return <Badge text="Internship" variant="default" />;
      default:
        return <Badge text={type} />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'OPEN' ? (
      <Badge text="Open" variant="success" />
    ) : (
      <Badge text="Closed" variant="danger" />
    );
  };

  if (isLoading || !selectedJob) {
    return <ShimmerScreen type="jobDetail" />;
  }

  const hasApplied =
    selectedJob.applicationStatus !== undefined &&
    selectedJob.applicationStatus !== null &&
    selectedJob.applicationStatus.hasApplied === true;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Job Header */}
        <Card>
          <Text style={styles.jobTitle}>{selectedJob.title}</Text>

          {selectedJob.company_name && (
            <Text style={styles.companyName}>{selectedJob.company_name}</Text>
          )}

          <View style={styles.badgesRow}>
            {getJobTypeBadge(selectedJob.type)}
            {getStatusBadge(selectedJob.status)}
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Location</Text>
              <Text style={styles.detailValue}>{selectedJob.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 Salary</Text>
              <Text style={styles.detailValue}>
                {selectedJob.salary
                  ? `₹${selectedJob.salary}L`
                  : 'Salary not specified'}
              </Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>📅 Posted</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedJob.postedDate || '').toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Job Description */}
        <Card title="Job Description">
          <Text style={styles.description}>{selectedJob.description}</Text>
        </Card>

        {/* Application Status or Apply Form */}
        {hasApplied ? (
          <Card>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Application Status</Text>
              <Badge text="Applied" variant="info" />
              <Text style={styles.statusMessage}>
                You have already applied for this job
              </Text>
            </View>
          </Card>
        ) : (
          <>
            {!showApplyForm ? (
              <Button
                title="Apply for this Job"
                onPress={() => setShowApplyForm(true)}
                disabled={selectedJob.status !== 'OPEN'}
              />
            ) : (
              <Card title="Submit Application">
                <Text style={styles.coverLetterLabel}>
                  Write a brief cover letter explaining why you&apos;re a good
                  fit for this role:
                </Text>

                <TextInput
                  style={styles.coverLetterInput}
                  placeholder="Dear Hiring Manager,..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={coverLetter}
                  onChangeText={setCoverLetter}
                />

                {/* Resume Section */}
                <View style={styles.resumeSection}>
                  <Text style={styles.resumeSectionTitle}>Resume</Text>

                  {user?.resume_url && !resumeFile ? (
                    <View style={styles.resumeProfileBox}>
                      <Text style={styles.resumeProfileTitle}>
                        ✓ Using Profile Resume
                      </Text>
                      <Text style={styles.resumeProfileText}>
                        Your profile resume will be used for this application
                      </Text>
                    </View>
                  ) : resumeFile ? (
                    <View style={styles.resumeUploadedBox}>
                      <Text style={styles.resumeUploadedTitle}>
                        ✓ New Resume Selected
                      </Text>
                      <Text style={styles.resumeUploadedText}>
                        {resumeFileName}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.resumeEmptyBox}>
                      <Text style={styles.resumeEmptyIcon}>
                        📄 No resume selected
                      </Text>
                      <Text style={styles.resumeEmptyText}>
                        {user?.resume_url
                          ? 'Using profile resume or upload a new one'
                          : 'Upload your resume to apply'}
                      </Text>
                    </View>
                  )}

                  <Button
                    title={resumeFile ? 'Change Resume' : 'Upload Resume'}
                    onPress={handleResumeUpload}
                    variant="outline"
                  />

                  <Text style={styles.supportedFormats}>
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <View style={styles.buttonFlex}>
                    <Button
                      title="Cancel"
                      onPress={() => setShowApplyForm(false)}
                      variant="outline"
                      disabled={applying}
                    />
                  </View>
                  <View style={styles.buttonFlex}>
                    <Button
                      title="Submit"
                      onPress={handleApply}
                      loading={applying || isUploadingResume}
                      disabled={applying || isUploadingResume}
                    />
                  </View>
                </View>
              </Card>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
