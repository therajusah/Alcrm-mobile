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
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

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
  const [isLoading, setIsLoading] = useState(false);
  const [interviewSessions, setInterviewSessions] = useState<
    InterviewSession[]
  >([]);
  const [activeTab, setActiveTab] = useState('MOCK_INTERVIEW');
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
      borderRadius: 8,
      padding: 4,
      marginBottom: 24,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
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
      backgroundColor: colors.success,
      paddingVertical: 16,
      borderRadius: 8,
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

  // Helper function to check if a session type has a pending or scheduled session
  const hasPendingOrScheduledSession = (sessionTypeId: string): boolean => {
    return interviewSessions.some(
      s =>
        s.session_type === sessionTypeId &&
        ['PENDING', 'SCHEDULED'].includes(s.status)
    );
  };

  const loadInterviewSessions = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSessions = [
        {
          session_id: '1',
          session_type: 'MOCK_INTERVIEW',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          scheduled_at: null,
          notes: 'Domain: Accounting & Finance, Experience: Mid Level',
          session_rating: null,
          session_feedback: null,
        },
        {
          session_id: '2',
          session_type: 'DOMAIN_COACHING',
          status: 'COMPLETED',
          created_at: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          scheduled_at: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notes: 'Domain: Technology & IT, Experience: Senior Level',
          session_rating: 5,
          session_feedback: 'Great session!',
        },
      ];
      setInterviewSessions(mockSessions);
    } catch (error) {
      console.error('Error loading interview sessions:', error);
    }
  }, []);

  useEffect(() => {
    loadInterviewSessions();
  }, [loadInterviewSessions]);

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      Alert.alert(
        'Limit Reached',
        'You have reached the maximum number of interview prep sessions (3)'
      );
      return;
    }

    if (!formData.domain || !formData.experience_level) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    if (hasPendingOrScheduledSession(formData.session_type)) {
      Alert.alert(
        'Duplicate',
        'You already have a pending session of this type in progress'
      );
      return;
    }

    try {
      setIsLoading(true);

      // Mock API call - replace with actual implementation
      await new Promise<void>(resolve => {
        global.setTimeout(resolve, 1000);
      });

      Alert.alert('Success', 'Interview prep session booked successfully!');
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
      Alert.alert('Error', 'Failed to book interview prep session');
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
      loadInterviewSessions();
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
      'Cancel Session',
      'Are you sure you want to cancel this session?',
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
              Alert.alert('Success', 'Session cancelled successfully');
              loadInterviewSessions();
            } catch {
              Alert.alert('Error', 'Failed to cancel session');
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Domain-Specific Interview Prep</Text>
          <Text style={styles.headerSubtitle}>
            Professional interview preparation tailored to your industry and
            role
          </Text>
        </View>

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
                activeTab === type.id &&
                  styles.tabButtonActive,
              ]}
              onPress={() => {
                setActiveTab(type.id);
                setFormData(prev => ({ ...prev, session_type: type.id }));
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === type.id &&
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
            activeTab === sessionType.id && (
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
                        hasPendingOrScheduledSession(sessionType.id)
                      }
                    >
                      <Text style={styles.submitButtonText}>
                        {isLoading
                          ? 'Booking...'
                          : hasPendingOrScheduledSession(sessionType.id)
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
    </ScrollView>
  );
}
