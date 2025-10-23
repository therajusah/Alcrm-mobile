import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { userApi } from '../../services/api';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';

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
  const { showAlert, hideAlert, alertState } = useModernAlert();
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
      paddingHorizontal: 20,
      paddingVertical: 20,
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
      backgroundColor: `${colors.primary}15`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    usageTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 8,
    },
    usageText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    formTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    formDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 22,
    },
    radioGroup: {
      marginBottom: 24,
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
      fontSize: 16,
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
      marginBottom: 24,
    },
    fileInputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    fileButton: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    fileButtonText: {
      color: colors.text,
      fontSize: 16,
    },
    selectedFile: {
      marginTop: 8,
      fontSize: 14,
      color: colors.success,
    },
    notesInput: {
      marginBottom: 24,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    submitButtonText: {
      color: colors.textInverse,
      fontSize: 18,
      fontWeight: '600',
    },
    serviceTitle: {
      fontSize: 20,
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
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: `${colors.success}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    featureText: {
      flex: 1,
      fontSize: 16,
      color: colors.textSecondary,
    },
    pricingCard: {
      backgroundColor: `${colors.primary}15`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    pricingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
    },
    pricingAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
    },
    pricingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    requestsSection: {
      marginTop: 24,
    },
    requestsTitle: {
      fontSize: 22,
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
      marginLeft: 8,
    },
    requestActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
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
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    feedbackTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    feedbackText: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    ratingSection: {
      marginTop: 12,
    },
    ratingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    ratingStars: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    starButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    starText: {
      fontSize: 20,
    },
    ratingInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      minHeight: 80,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: colors.border,
    },
    ratingSubmitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    ratingSubmitText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: '500',
    },
    completedRating: {
      backgroundColor: `${colors.success}15`,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: `${colors.success}30`,
    },
    completedRatingText: {
      fontSize: 14,
      color: colors.success,
      fontWeight: '500',
    },
  });

  const MAX_REQUESTS = 2;
  const requestsUsed = reviewRequests.length;
  const requestsRemaining = MAX_REQUESTS - requestsUsed;

  const loadReviewRequests = useCallback(async () => {
    try {
      // Load CV review sessions from API
      const response = await userApi.getMySessions({
        session_type: 'CV_REVIEW',
        page: 1,
        pageSize: 50,
      });
      
      // Transform the response to match our interface
      const sessions = response.items.map(session => ({
        session_id: session.session_id,
        session_type: session.session_type,
        status: session.status,
        created_at: session.created_at,
        notes: session.notes,
        session_rating: session.session_rating,
        session_feedback: session.session_feedback,
        mentor_notes: session.mentor_notes,
      }));
      
      setReviewRequests(sessions);
    } catch (error) {
      console.error('Error loading review requests:', error);
      // Fallback to empty array if API fails
      setReviewRequests([]);
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
          showAlert('Error', 'File size must be less than 10MB', [
            {
              text: 'OK',
              onPress: hideAlert,
            },
          ]);
          return;
        }

        // Validate MIME type
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (file.mimeType && !validTypes.includes(file.mimeType)) {
          showAlert('Error', 'Please select a PDF, DOC, or DOCX file', [
            {
              text: 'OK',
              onPress: hideAlert,
            },
          ]);
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
      showAlert('Error', 'Failed to select file', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    }
  };

  const handleFileUpload = async (file: FileData) => {
    try {
      setUploading(true);
      // Upload file using the real API
      const result = await userApi.uploadResume(file.uri, file.name);
      const uploadedUrl = result.resume_url || result.url;
      setProfileResumeUrl(uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload resume';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      showAlert(
        'Limit Reached',
        'You have reached the maximum number of CV review requests (2)',
        [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]
      );
      return;
    }

    if (!formData.session_type) {
      showAlert('Required', 'Please fill in all required fields', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      return;
    }

    if (formData.use_current_resume) {
      if (!profileResumeUrl) {
        showAlert('Error', 'No resume on file. Please upload a new resume.', [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]);
        return;
      }
    } else {
      if (!selectedFile) {
        showAlert('Error', 'Please select a resume file to upload', [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]);
        return;
      }
      const uploaded = await handleFileUpload(selectedFile);
      if (!uploaded) return;
    }

    try {
      setIsLoading(true);
      
      // Submit CV review request via API
      await userApi.bookSession({
        session_type: 'CV_REVIEW',
        notes: formData.notes || 'CV review requested',
      });
      
      showAlert('Success', 'CV review request submitted successfully!', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      setFormData({
        session_type: 'CV_REVIEW',
        notes: '',
        use_current_resume: true,
      });
      setSelectedFile(null);
      loadReviewRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit CV review request';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async (sessionId: string) => {
    const rs = ratingState[sessionId];
    if (!rs || rs.submitting || (!rs.rating && !rs.feedback)) return;

    setRatingState(prev => ({ ...prev, [sessionId]: { ...rs, submitting: true } }));
    try {
      // Submit rating via API
      await userApi.rateSession(sessionId, rs.rating, rs.feedback);
      
      showAlert('Success', 'Feedback submitted', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      loadReviewRequests();
    } catch (error) {
      console.error('Error submitting rating:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
      showAlert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
    } finally {
      setRatingState(prev => ({
        ...prev,
        [sessionId]: { ...prev[sessionId], submitting: false },
      }));
    }
  };

  const cancelSession = async (sessionId: string) => {
    showAlert(
      'Cancel Request',
      'Are you sure you want to cancel this CV review request?',
      [
        { 
          text: 'No', 
          style: 'cancel', 
          onPress: () => {
            hideAlert();
          }
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            hideAlert();
            try {
              // Call the real API to cancel the session
              await userApi.cancelSession(sessionId);
              
              // Update the session status to cancelled
              setReviewRequests(prev => 
                prev.map(request => 
                  request.session_id === sessionId 
                    ? { ...request, status: 'CANCELLED' }
                    : request
                )
              );
              
              showAlert('Success', 'Request cancelled successfully', [
                {
                  text: 'OK',
                  onPress: hideAlert,
                },
              ]);
            } catch (error) {
              console.error('Error cancelling session:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to cancel request';
              showAlert('Error', errorMessage, [
                {
                  text: 'OK',
                  onPress: hideAlert,
                },
              ]);
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

        {/* Request Form */}
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
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 10,
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
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 6,
                  }}
                >
                  Additional Notes (Optional)
                </Text>
                <TextInput
                  style={[styles.ratingInput, { minHeight: 70 }]}
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

        {/* Service Details */}
        <Card>
          <Text style={styles.serviceTitle}>What You&apos;ll Get</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Comprehensive Review</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>
              Industry-Specific Feedback
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Enhanced Version</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
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

        <ModernAlert
          visible={alertState.visible}
          title={alertState.title}
          message={alertState.message}
          buttons={alertState.buttons}
          onClose={hideAlert}
        />
      </View>
    </ScrollView>
  );
}
