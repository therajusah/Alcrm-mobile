import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { userApi } from '../../services/api';

interface ReviewRequest {
  session_id: string;
  status: string;
  session_type?: string;
  notes?: string;
  created_at?: string;
  mentor_notes?: string | null;
  session_feedback?: string | null;
  session_rating?: number | null;
}

interface FileData {
  name: string;
  uri: string;
  type: string;
}

export default function CVReviewScreen() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [formData, setFormData] = useState({
    session_type: 'CV_REVIEW',
    notes: '',
    use_current_resume: true,
  });
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [profileResumeUrl, setProfileResumeUrl] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ratingState, setRatingState] = useState<{
    [id: string]: { rating: number; feedback: string; submitting: boolean };
  }>({});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    header: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    usageTracker: {
      backgroundColor: `${colors.primary}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.primary}20`,
    },
    usageTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    usageText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    formDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    radioGroup: {
      marginBottom: 20,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 8,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textInverse,
    },
    radioLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    statusAvailable: {
      backgroundColor: `${colors.success}20`,
    },
    statusUnavailable: {
      backgroundColor: `${colors.error}20`,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    statusTextAvailable: {
      color: colors.success,
    },
    statusTextUnavailable: {
      color: colors.error,
    },
    fileInput: {
      marginBottom: 20,
    },
    fileInputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    fileButton: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    fileButtonText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedFile: {
      marginTop: 8,
      fontSize: 12,
      color: colors.success,
    },
    notesInput: {
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    serviceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: `${colors.success}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    pricingCard: {
      backgroundColor: `${colors.primary}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    pricingTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
    },
    pricingAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
    },
    pricingDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    requestsSection: {
      marginTop: 24,
    },
    requestsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    requestHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    requestStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    requestDate: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    requestActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    cancelButton: {
      borderColor: colors.error,
    },
    cancelButtonText: {
      color: colors.error,
    },
    requestDetails: {
      marginBottom: 12,
    },
    requestDetailRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    requestDetailLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      width: 100,
    },
    requestDetailValue: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    feedbackSection: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
    },
    feedbackTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    feedbackText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    ratingSection: {
      marginTop: 12,
    },
    ratingTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    ratingStars: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    starButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    starText: {
      fontSize: 16,
    },
    ratingInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    ratingSubmitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    ratingSubmitText: {
      color: colors.textInverse,
      fontSize: 12,
      fontWeight: '500',
    },
    completedRating: {
      backgroundColor: `${colors.success}10`,
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
    },
    completedRatingText: {
      fontSize: 12,
      color: colors.success,
    },
  });

  const MAX_REQUESTS = 2;
  const requestsUsed = reviewRequests.length;
  const requestsRemaining = MAX_REQUESTS - requestsUsed;

  const loadReviewRequests = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockRequests = [
        {
          session_id: '1',
          status: 'PENDING',
          session_type: 'CV_REVIEW',
          created_at: new Date().toISOString(),
          notes: 'Please focus on ATS optimization',
          mentor_notes: null,
          session_rating: null,
          session_feedback: null,
        },
        {
          session_id: '2',
          status: 'COMPLETED',
          session_type: 'CV_REVIEW',
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notes: 'General review needed',
          mentor_notes:
            'Your resume has good content but needs better formatting. I have enhanced the structure and optimized for ATS.',
          session_rating: 5,
          session_feedback: 'Excellent service!',
        },
      ];
      setReviewRequests(mockRequests);
    } catch (error) {
      console.error('Error loading review requests:', error);
    }
  }, []);

  useEffect(() => {
    loadReviewRequests();
    // Load profile resume status
    (async () => {
      try {
        setProfileLoading(true);
        const profile = await userApi.getProfile();
        setProfileResumeUrl(profile.resume_url || null);
      } catch (error) {
        console.error('Failed to load profile for resume status:', error);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [loadReviewRequests]);

  useEffect(() => {
    if (!profileLoading && !profileResumeUrl && formData.use_current_resume) {
      setFormData(prev => ({ ...prev, use_current_resume: false }));
    }
  }, [profileLoading, profileResumeUrl, formData.use_current_resume]);

  const handleSelectFile = async () => {
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

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size && file.size > maxSize) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return;
        }

        // Validate MIME type
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (file.mimeType && !validTypes.includes(file.mimeType)) {
          Alert.alert('Error', 'Please select a PDF, DOC, or DOCX file');
          return;
        }

        setSelectedFile({
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'application/pdf',
        });
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleFileUpload = async (_file: unknown) => {
    try {
      setUploading(true);
      // Mock file upload - replace with actual implementation
      const mockUrl = 'https://example.com/resume.pdf';
      setProfileResumeUrl(mockUrl);
      return mockUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload resume');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      Alert.alert(
        'Limit Reached',
        'You have reached the maximum number of CV review requests (2)'
      );
      return;
    }

    if (!formData.session_type) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    if (formData.use_current_resume) {
      if (!profileResumeUrl) {
        Alert.alert('Error', 'No resume on file. Please upload a new resume.');
        return;
      }
    } else {
      if (!selectedFile) {
        Alert.alert('Error', 'Please select a resume file to upload');
        return;
      }
      const uploaded = await handleFileUpload(selectedFile);
      if (!uploaded) return;
    }

    try {
      setIsLoading(true);
      // Mock API call - replace with actual implementation
      await new Promise<void>(resolve => {
        global.setTimeout(resolve, 1000);
      });
      Alert.alert('Success', 'CV review request submitted successfully!');
      setFormData({
        session_type: 'CV_REVIEW',
        notes: '',
        use_current_resume: true,
      });
      setSelectedFile(null);
      loadReviewRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit CV review request');
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async (_id: string) => {
    const rs = ratingState[_id];
    if (!rs || rs.submitting || (!rs.rating && !rs.feedback)) return;

    setRatingState(prev => ({ ...prev, [_id]: { ...rs, submitting: true } }));
    try {
      // Mock API call - replace with actual implementation
      await new Promise<void>(resolve => {
        global.setTimeout(resolve, 1000);
      });
      Alert.alert('Success', 'Feedback submitted');
      loadReviewRequests();
    } catch {
      Alert.alert('Error', 'Failed to submit feedback');
    } finally {
      setRatingState(prev => ({
        ...prev,
        [_id]: { ...prev[_id], submitting: false },
      }));
    }
  };

  const cancelSession = async (_id: string) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this CV review request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock API call - replace with actual implementation
              await new Promise<void>(resolve => {
                global.setTimeout(resolve, 1000);
              });
              Alert.alert('Success', 'Request cancelled successfully');
              loadReviewRequests();
            } catch {
              Alert.alert('Error', 'Failed to cancel request');
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge text="Pending" variant="warning" />;
      case 'SCHEDULED':
        return <Badge text="Scheduled" variant="info" />;
      case 'COMPLETED':
        return <Badge text="Completed" variant="success" />;
      case 'CANCELLED':
        return <Badge text="Cancelled" variant="danger" />;
      default:
        return <Badge text={status} variant="default" />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Usage Tracker */}
        <View style={styles.usageTracker}>
          <Text style={styles.usageTitle}>
            Requests Used: {requestsUsed} / {MAX_REQUESTS}
          </Text>
          <Text style={styles.usageText}>
            You have {requestsRemaining} review request
            {requestsRemaining !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Request Form */}
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={styles.formTitle}>Submit CV Review Request</Text>
              <Text style={styles.formDescription}>
                Get expert feedback on your resume structure, content, and
                formatting
              </Text>

              {requestsRemaining <= 0 ? (
                <View
                  style={{
                    padding: 16,
                    backgroundColor: `${colors.error}10`,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: colors.error, fontSize: 14 }}>
                    You have reached the maximum number of CV review requests
                    (2). Please wait for your current requests to be completed.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Resume Source */}
                  <View style={styles.radioGroup}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 12,
                      }}
                    >
                      Resume Source
                    </Text>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() =>
                        setFormData(prev => ({
                          ...prev,
                          use_current_resume: true,
                        }))
                      }
                    >
                      <View
                        style={[
                          styles.radioButton,
                          formData.use_current_resume &&
                            styles.radioButtonSelected,
                        ]}
                      >
                        {formData.use_current_resume && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>
                        Use my current resume
                        {profileLoading && (
                          <Text style={{ color: colors.textTertiary }}>
                            {' '}
                            (checking...)
                          </Text>
                        )}
                        {!profileLoading && profileResumeUrl && (
                          <View
                            style={[styles.statusBadge, styles.statusAvailable]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                styles.statusTextAvailable,
                              ]}
                            >
                              Available
                            </Text>
                          </View>
                        )}
                        {!profileLoading && !profileResumeUrl && (
                          <View
                            style={[
                              styles.statusBadge,
                              styles.statusUnavailable,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                styles.statusTextUnavailable,
                              ]}
                            >
                              None uploaded
                            </Text>
                          </View>
                        )}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() =>
                        setFormData(prev => ({
                          ...prev,
                          use_current_resume: false,
                        }))
                      }
                    >
                      <View
                        style={[
                          styles.radioButton,
                          !formData.use_current_resume &&
                            styles.radioButtonSelected,
                        ]}
                      >
                        {!formData.use_current_resume && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>Upload new resume</Text>
                    </TouchableOpacity>
                  </View>

                  {!formData.use_current_resume && (
                    <View style={styles.fileInput}>
                      <Text style={styles.fileInputLabel}>
                        Upload Resume (PDF, DOC, DOCX)
                      </Text>
                      <TouchableOpacity
                        style={styles.fileButton}
                        onPress={handleSelectFile}
                      >
                        <Text style={styles.fileButtonText}>Select File</Text>
                      </TouchableOpacity>
                      {selectedFile && (
                        <Text style={styles.selectedFile}>
                          Selected: {selectedFile.name}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Notes */}
                  <View style={styles.notesInput}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 8,
                      }}
                    >
                      Additional Notes (Optional)
                    </Text>
                    <TextInput
                      style={[styles.ratingInput, { minHeight: 80 }]}
                      placeholder="Any specific areas you'd like us to focus on? (e.g., formatting, content structure, industry-specific keywords)"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={formData.notes}
                      onChangeText={text =>
                        setFormData(prev => ({ ...prev, notes: text }))
                      }
                      multiline
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitRequest}
                    disabled={isLoading || uploading || requestsRemaining <= 0}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading || uploading
                        ? 'Submitting...'
                        : 'Submit Review Request'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Card>
          </View>

          {/* Service Details */}
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={styles.serviceTitle}>What You&apos;ll Get</Text>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Comprehensive Review</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>
                  Industry-Specific Feedback
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Enhanced Version</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>ATS Optimization</Text>
              </View>

              <View style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>Pricing</Text>
                <Text style={styles.pricingAmount}>₹2,999</Text>
                <Text style={styles.pricingDescription}>
                  Professional CV enhancement by industry experts
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Previous Requests */}
        {reviewRequests.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.requestsTitle}>Your CV Review Requests</Text>
            {reviewRequests.map(request => (
              <Card key={request.session_id}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestStatus}>
                    {getStatusBadge(request.status)}
                    <Text style={styles.requestDate}>
                      {request.created_at
                        ? new Date(request.created_at).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.requestActions}>
                    {request.status === 'PENDING' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => cancelSession(request.session_id)}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            styles.cancelButtonText,
                          ]}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                    {request.status === 'COMPLETED' && request.mentor_notes && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                          View Feedback
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.requestDetails}>
                  <View style={styles.requestDetailRow}>
                    <Text style={styles.requestDetailLabel}>Status:</Text>
                    <Text style={styles.requestDetailValue}>
                      {request.status}
                    </Text>
                  </View>
                  {request.notes && (
                    <View style={styles.requestDetailRow}>
                      <Text style={styles.requestDetailLabel}>Your Notes:</Text>
                      <Text style={styles.requestDetailValue}>
                        {request.notes}
                      </Text>
                    </View>
                  )}
                </View>

                {request.mentor_notes && (
                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackTitle}>Feedback:</Text>
                    <Text style={styles.feedbackText}>
                      {request.mentor_notes}
                    </Text>
                  </View>
                )}

                {request.status === 'COMPLETED' && !request.session_rating && (
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingTitle}>Rate this review</Text>
                    <View style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                          key={star}
                          style={styles.starButton}
                          onPress={() =>
                            setRatingState(prev => ({
                              ...prev,
                              [request.session_id]: {
                                ...(prev[request.session_id] || {
                                  rating: 0,
                                  feedback: '',
                                  submitting: false,
                                }),
                                rating: star,
                              },
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.starText,
                              {
                                color:
                                  (ratingState[request.session_id]?.rating ||
                                    0) >= star
                                    ? colors.warning
                                    : colors.border,
                              },
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={styles.ratingInput}
                      placeholder="Optional feedback"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={ratingState[request.session_id]?.feedback || ''}
                      onChangeText={text =>
                        setRatingState(prev => ({
                          ...prev,
                          [request.session_id]: {
                            ...(prev[request.session_id] || {
                              rating: 0,
                              feedback: '',
                              submitting: false,
                            }),
                            feedback: text,
                          },
                        }))
                      }
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.ratingSubmitButton}
                      disabled={ratingState[request.session_id]?.submitting}
                      onPress={() => submitRating(request.session_id)}
                    >
                      <Text style={styles.ratingSubmitText}>
                        {ratingState[request.session_id]?.submitting
                          ? 'Submitting...'
                          : 'Submit Feedback'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {request.status === 'COMPLETED' && request.session_rating && (
                  <View style={styles.completedRating}>
                    <Text style={styles.completedRatingText}>
                      Your Rating: {request.session_rating}/5
                      {request.session_feedback &&
                        ` - "${request.session_feedback}"`}
                    </Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
