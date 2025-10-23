import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { userApi } from '../../services/api';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';

interface InterviewSession {
  session_id: string;
  status: string;
  session_type?: string;
  domain?: string;
  experience_level?: string;
  target_role?: string;
  specific_focus?: string;
  preferred_date?: string;
  scheduled_at?: string | null;
  notes?: string;
  created_at?: string;
  mentor_notes?: string | null;
  session_feedback?: string | null;
  session_rating?: number | null;
}

export default function InterviewPrepScreen() {
  const { colors } = useTheme();
  const { showAlert, hideAlert, alertState } = useModernAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [interviewSessions, setInterviewSessions] = useState<
    InterviewSession[]
  >([]);
  const [activeTab, setActiveTab] = useState('mock-interview');
  const [formData, setFormData] = useState({
    session_type: 'MOCK_INTERVIEW',
    domain: '',
    experience_level: '',
    target_role: '',
    specific_focus: '',
    preferred_date: '',
  });
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
      backgroundColor: `${colors.success}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.success}20`,
    },
    usageTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.success,
      marginBottom: 8,
    },
    usageText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 20,
      padding: 4,
      marginBottom: 24,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: colors.primary,
    },
    tabButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    tabButtonTextActive: {
      color: colors.textInverse,
    },
    sessionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sessionInfo: {
      flex: 1,
    },
    sessionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    sessionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    sessionPricing: {
      alignItems: 'flex-end',
    },
    sessionPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.success,
    },
    sessionDuration: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
      marginBottom: 8,
    },
    featureIcon: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: `${colors.success}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    featureText: {
      fontSize: 12,
      color: colors.textSecondary,
      flex: 1,
    },
    formSection: {
      marginBottom: 20,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    formTextArea: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    dateInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
    },
    submitButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    sessionsList: {
      marginTop: 24,
    },
    sessionsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    sessionItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sessionItemInfo: {
      flex: 1,
    },
    sessionItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    sessionItemDate: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    sessionItemActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
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
      borderRadius: 15,
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
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
  });

  const MAX_REQUESTS = 3;
  // Count only active sessions (exclude completed and cancelled)
  const requestsUsed = interviewSessions.filter(
    session =>
      session.status?.toUpperCase() !== 'COMPLETED' &&
      session.status?.toUpperCase() !== 'CANCELLED'
  ).length;
  const requestsRemaining = MAX_REQUESTS - requestsUsed;

  const sessionTypes = [
    {
      id: 'MOCK_INTERVIEW',
      title: 'Mock Interview',
      description: 'Full-length mock interview with industry professionals',
      duration: '60 minutes',
      price: '₹3,999',
      features: [
        'Real interview simulation',
        'Detailed feedback',
        'Performance scoring',
        'Improvement recommendations',
      ],
    },
    {
      id: 'DOMAIN_COACHING',
      title: 'Domain Coaching',
      description:
        'Focused coaching on domain-specific questions and scenarios',
      duration: '45 minutes',
      price: '₹2,999',
      features: [
        'Industry-specific preparation',
        'Technical question practice',
        'Case study discussions',
        'Expert guidance',
      ],
    },
    {
      id: 'BEHAVIORAL_PREP',
      title: 'Behavioral Prep',
      description: 'Practice behavioral and situational interview questions',
      duration: '30 minutes',
      price: '₹1,999',
      features: [
        'STAR method training',
        'Common questions practice',
        'Communication skills',
        'Confidence building',
      ],
    },
  ];

  const domains = [
    'Accounting & Finance',
    'Audit & Assurance',
    'Tax & Compliance',
    'Business Consulting',
    'Banking & Financial Services',
    'Technology & IT',
    'Healthcare',
    'Manufacturing',
    'Retail & Consumer Goods',
    'Other',
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (6-10 years)',
    'Executive (10+ years)',
  ];

  const targetRoles = [
    'Analyst',
    'Associate',
    'Senior Associate',
    'Manager',
    'Senior Manager',
    'Director',
    'Partner',
  ];

  const loadInterviewSessions = useCallback(async () => {
    try {
      // Load interview prep sessions from API
      const response = await userApi.getMySessions({
        session_type: 'MOCK_INTERVIEW,DOMAIN_COACHING,BEHAVIORAL_PREP',
        page: 1,
        pageSize: 50,
      });
      
      // Transform the response to match our interface
      const sessions = response.items.map(session => {
        // Parse the notes field to extract interview prep data
        let parsedNotes: any = {};
        try {
          parsedNotes = session.notes ? JSON.parse(session.notes) : {};
        } catch (error) {
          // Log the JSON parsing error with context for debugging
          console.error('Failed to parse session notes JSON:', {
            sessionId: session.session_id,
            sessionType: session.session_type,
            rawNotes: session.notes,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
          });
          
          // If parsing fails, use the notes as-is
          parsedNotes = { message: session.notes };
        }
        
        return {
          session_id: session.session_id,
          session_type: session.session_type,
          status: session.status,
          created_at: session.created_at,
          scheduled_at: session.scheduled_at,
          notes: session.notes,
          session_rating: session.session_rating,
          session_feedback: session.session_feedback,
          mentor_notes: session.mentor_notes,
          domain: parsedNotes.domain,
          experience_level: parsedNotes.experience_level,
          target_role: parsedNotes.target_role,
          specific_focus: parsedNotes.specific_focus,
          preferred_date: parsedNotes.preferred_date,
        };
      });
      
      setInterviewSessions(sessions);
    } catch (error) {
      console.error('Error loading interview sessions:', error);
      // Fallback to empty array if API fails
      setInterviewSessions([]);
    }
  }, []);

  useEffect(() => {
    loadInterviewSessions();
  }, [loadInterviewSessions]);

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      showAlert(
        'Limit Reached',
        'You have reached the maximum number of interview prep sessions (3)',
        [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]
      );
      return;
    }

    if (!formData.domain || !formData.experience_level) {
      showAlert('Required', 'Please fill in all required fields', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      return;
    }

    const duplicate = interviewSessions.some(
      s =>
        s.session_type === formData.session_type &&
        ['PENDING', 'SCHEDULED'].includes(s.status)
    );
    if (duplicate) {
      showAlert(
        'Duplicate',
        'You already have a pending session of this type in progress',
        [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]
      );
      return;
    }

    try {
      setIsLoading(true);

      // Submit interview prep session via API
      await userApi.bookSession({
        session_type: formData.session_type,
        notes: JSON.stringify({
          domain: formData.domain,
          experience_level: formData.experience_level,
          target_role: formData.target_role,
          specific_focus: formData.specific_focus,
          preferred_date: formData.preferred_date,
        }),
      });

      showAlert('Success', 'Interview prep session booked successfully!', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      setFormData({
        session_type: 'MOCK_INTERVIEW',
        domain: '',
        experience_level: '',
        target_role: '',
        specific_focus: '',
        preferred_date: '',
      });
      loadInterviewSessions();
    } catch (error) {
      console.error('Error booking session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to book interview prep session';
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
      loadInterviewSessions();
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
      'Cancel Session',
      'Are you sure you want to cancel this session?',
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
              setInterviewSessions(prev => 
                prev.map(session => 
                  session.session_id === sessionId 
                    ? { ...session, status: 'CANCELLED' }
                    : session
                )
              );
              
              showAlert('Success', 'Session cancelled successfully', [
                {
                  text: 'OK',
                  onPress: hideAlert,
                },
              ]);
            } catch (error) {
              console.error('Error cancelling session:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to cancel session';
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
            Sessions Used: {requestsUsed} / {MAX_REQUESTS}
          </Text>
          <Text style={styles.usageText}>
            You have {requestsRemaining} session
            {requestsRemaining !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        {/* Session Type Tabs */}
        <View style={styles.tabContainer}>
          {sessionTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.tabButton,
                activeTab === type.id.toLowerCase().replace('_', '-') &&
                  styles.tabButtonActive,
              ]}
              onPress={() => {
                setActiveTab(type.id.toLowerCase().replace('_', '-'));
                setFormData(prev => ({ ...prev, session_type: type.id }));
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === type.id.toLowerCase().replace('_', '-') &&
                    styles.tabButtonTextActive,
                ]}
              >
                {type.title.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session Details */}
        {sessionTypes.map(
          sessionType =>
            activeTab === sessionType.id.toLowerCase().replace('_', '-') && (
              <Card key={sessionType.id}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{sessionType.title}</Text>
                    <Text style={styles.sessionDescription}>
                      {sessionType.description}
                    </Text>
                  </View>
                  <View style={styles.sessionPricing}>
                    <Text style={styles.sessionPrice}>{sessionType.price}</Text>
                    <Text style={styles.sessionDuration}>
                      {sessionType.duration}
                    </Text>
                  </View>
                </View>

                <View style={styles.featuresGrid}>
                  {sessionType.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={styles.featureIcon}>
                        <Text style={{ color: colors.success, fontSize: 10 }}>
                          ✓
                        </Text>
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {requestsRemaining <= 0 ? (
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: `${colors.error}10`,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: colors.error, fontSize: 14 }}>
                      You have reached the maximum number of interview prep
                      sessions (3). Please wait for your current sessions to be
                      completed.
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Domain Selection */}
                    <View style={styles.formSection}>
                      <Text style={styles.formLabel}>Domain/Industry *</Text>
                      <View
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                          borderRadius: 8,
                          marginBottom: 16,
                        }}
                      >
                        {domains.map((domain, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth:
                                index < domains.length - 1 ? 1 : 0,
                              borderBottomColor: colors.border,
                            }}
                            onPress={() =>
                              setFormData(prev => ({ ...prev, domain }))
                            }
                          >
                            <Text
                              style={{
                                color:
                                  formData.domain === domain
                                    ? colors.primary
                                    : colors.text,
                                fontWeight:
                                  formData.domain === domain ? '600' : '400',
                              }}
                            >
                              {domain}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Experience Level */}
                    <View style={styles.formSection}>
                      <Text style={styles.formLabel}>Experience Level *</Text>
                      <View
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                          borderRadius: 8,
                          marginBottom: 16,
                        }}
                      >
                        {experienceLevels.map((level, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth:
                                index < experienceLevels.length - 1 ? 1 : 0,
                              borderBottomColor: colors.border,
                            }}
                            onPress={() =>
                              setFormData(prev => ({
                                ...prev,
                                experience_level: level,
                              }))
                            }
                          >
                            <Text
                              style={{
                                color:
                                  formData.experience_level === level
                                    ? colors.primary
                                    : colors.text,
                                fontWeight:
                                  formData.experience_level === level
                                    ? '600'
                                    : '400',
                              }}
                            >
                              {level}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Target Role */}
                    <View style={styles.formSection}>
                      <Text style={styles.formLabel}>
                        Target Role (Optional)
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                          borderRadius: 8,
                          marginBottom: 16,
                        }}
                      >
                        {targetRoles.map((role, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth:
                                index < targetRoles.length - 1 ? 1 : 0,
                              borderBottomColor: colors.border,
                            }}
                            onPress={() =>
                              setFormData(prev => ({
                                ...prev,
                                target_role: role,
                              }))
                            }
                          >
                            <Text
                              style={{
                                color:
                                  formData.target_role === role
                                    ? colors.primary
                                    : colors.text,
                                fontWeight:
                                  formData.target_role === role ? '600' : '400',
                              }}
                            >
                              {role}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Specific Focus */}
                    <View style={styles.formSection}>
                      <Text style={styles.formLabel}>
                        Specific Focus Areas (Optional)
                      </Text>
                      <TextInput
                        style={styles.formTextArea}
                        placeholder="Any specific topics, skills, or areas you'd like to focus on during the session..."
                        placeholderTextColor={colors.inputPlaceholder}
                        value={formData.specific_focus}
                        onChangeText={(text: string) =>
                          setFormData(prev => ({
                            ...prev,
                            specific_focus: text,
                          }))
                        }
                        multiline
                      />
                    </View>

                    {/* Preferred Date */}
                    <View style={styles.formSection}>
                      <Text style={styles.formLabel}>
                        Preferred Date & Time
                      </Text>
                      <TextInput
                        style={styles.dateInput}
                        placeholder="Select date and time"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={formData.preferred_date}
                        onChangeText={(text: string) =>
                          setFormData(prev => ({
                            ...prev,
                            preferred_date: text,
                          }))
                        }
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmitRequest}
                      disabled={
                        isLoading ||
                        requestsRemaining <= 0 ||
                        interviewSessions.some(
                          s =>
                            s.session_type === sessionType.id &&
                            ['PENDING', 'SCHEDULED'].includes(s.status)
                        )
                      }
                    >
                      <Text style={styles.submitButtonText}>
                        {isLoading
                          ? 'Booking...'
                          : interviewSessions.some(
                                s =>
                                  s.session_type === sessionType.id &&
                                  ['PENDING', 'SCHEDULED'].includes(s.status)
                              )
                            ? 'Session In Progress'
                            : `Book ${sessionType.title} - ${sessionType.price}`}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Card>
            )
        )}

        {/* My Sessions */}
        <View style={styles.sessionsList}>
          <Text style={styles.sessionsTitle}>My Interview Sessions</Text>
          {interviewSessions.length > 0 ? (
            interviewSessions.map(session => (
              <Card key={session.session_id}>
                <View style={styles.sessionItemHeader}>
                  <View style={styles.sessionItemInfo}>
                    <Text style={styles.sessionItemTitle}>
                      {session.session_type?.replace('_', ' ') ||
                        'Interview Session'}
                    </Text>
                    <Text style={styles.sessionItemDate}>
                      {session.scheduled_at
                        ? new Date(session.scheduled_at).toLocaleDateString()
                        : 'Not scheduled'}
                    </Text>
                  </View>
                  <View style={styles.sessionItemActions}>
                    {getStatusBadge(session.status)}
                    {session.status === 'PENDING' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => cancelSession(session.session_id)}
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
                  </View>
                </View>

                {session.notes && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginTop: 8,
                    }}
                  >
                    {session.notes}
                  </Text>
                )}

                {session.status === 'COMPLETED' && !session.session_rating && (
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingTitle}>Rate this session</Text>
                    <View style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                          key={star}
                          style={styles.starButton}
                          onPress={() =>
                            setRatingState(prev => ({
                              ...prev,
                              [session.session_id]: {
                                ...(prev[session.session_id] || {
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
                                  (ratingState[session.session_id]?.rating ||
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
                      value={ratingState[session.session_id]?.feedback || ''}
                      onChangeText={(text: string) =>
                        setRatingState(prev => ({
                          ...prev,
                          [session.session_id]: {
                            ...(prev[session.session_id] || {
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
                      disabled={ratingState[session.session_id]?.submitting}
                      onPress={() => submitRating(session.session_id)}
                    >
                      <Text style={styles.ratingSubmitText}>
                        {ratingState[session.session_id]?.submitting
                          ? 'Submitting...'
                          : 'Submit Feedback'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {session.status === 'COMPLETED' && session.session_rating && (
                  <View style={styles.completedRating}>
                    <Text style={styles.completedRatingText}>
                      Rated: {session.session_rating}/5
                      {session.session_feedback &&
                        ` - "${session.session_feedback}"`}
                    </Text>
                  </View>
                )}
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No sessions booked yet</Text>
            </View>
          )}
        </View>
      </View>

      <ModernAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </ScrollView>
  );
}
