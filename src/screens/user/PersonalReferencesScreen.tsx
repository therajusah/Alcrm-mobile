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

interface ReferenceSession {
  session_id: string;
  status: string;
  session_type?: string;
  target_organization?: string;
  specific_company?: string;
  experience_level?: string;
  target_role?: string;
  message?: string;
  notes?: string;
  created_at?: string;
  mentor_notes?: string | null;
  session_feedback?: string | null;
  session_rating?: number | null;
}

export default function PersonalReferencesScreen() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [referenceSessions, setReferenceSessions] = useState<
    ReferenceSession[]
  >([]);
  const [ratingState, setRatingState] = useState<{
    [id: string]: { rating: number; feedback: string; submitting: boolean };
  }>({});
  const [formData, setFormData] = useState({
    target_organization: '',
    specific_company: '',
    message: '',
    experience_level: '',
    target_role: '',
  });

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
      backgroundColor: `${colors.info}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.info}20`,
    },
    usageTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.info,
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
    formSection: {
      marginBottom: 20,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    formInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
    },
    formTextArea: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
      minHeight: 120,
      textAlignVertical: 'top',
    },
    organizationSelector: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      marginBottom: 16,
    },
    organizationItem: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    organizationItemLast: {
      borderBottomWidth: 0,
    },
    organizationName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    organizationDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    organizationCompanies: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    companyBadge: {
      backgroundColor: `${colors.primary}20`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    companyBadgeText: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: '500',
    },
    selectedOrgInfo: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    selectedOrgTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    selectedOrgCompanies: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    submitButton: {
      backgroundColor: colors.info,
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
      backgroundColor: `${colors.info}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    pricingTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.info,
      marginBottom: 8,
    },
    pricingAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.info,
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

  const MAX_REQUESTS = 3;
  // Count only active sessions (exclude completed and cancelled)
  const requestsUsed = referenceSessions.filter(
    session =>
      session.status?.toUpperCase() !== 'COMPLETED' &&
      session.status?.toUpperCase() !== 'CANCELLED'
  ).length;
  const requestsRemaining = MAX_REQUESTS - requestsUsed;

  const organizations = [
    {
      id: 'big4',
      name: 'Big 4 Firms',
      companies: ['Deloitte', 'PwC', 'EY', 'KPMG'],
      description: 'Top global accounting and consulting firms',
    },
    {
      id: 'mid-tier',
      name: 'Mid-Tier Firms',
      companies: ['BDO', 'Grant Thornton', 'RSM', 'Baker Tilly'],
      description: 'Established mid-tier accounting firms',
    },
    {
      id: 'banks',
      name: 'Banks & Financial Services',
      companies: ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'],
      description: 'Leading banking and financial institutions',
    },
    {
      id: 'corporates',
      name: 'Corporates & MNCs',
      companies: ['TCS', 'Infosys', 'Wipro', 'HCL'],
      description: 'Fortune 500 and large corporate organizations',
    },
    {
      id: 'consulting',
      name: 'Consulting Firms',
      companies: ['McKinsey', 'BCG', 'Bain', 'Accenture'],
      description: 'Top management and strategy consulting firms',
    },
    {
      id: 'startups',
      name: 'Startups & Unicorns',
      companies: ['Razorpay', 'CRED', 'PhonePe', 'Groww'],
      description: 'High-growth startups and unicorn companies',
    },
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

  const loadReferenceSessions = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSessions = [
        {
          session_id: '1',
          session_type: 'PERSONAL_REFERENCE',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          notes:
            'Organization: Big 4 Firms, Experience: Mid Level, Message: Looking for audit role',
          session_rating: null,
          session_feedback: null,
        },
        {
          session_id: '2',
          session_type: 'PERSONAL_REFERENCE',
          status: 'COMPLETED',
          created_at: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notes:
            'Organization: Banks & Financial Services, Experience: Senior Level, Message: Seeking management role',
          session_rating: 5,
          session_feedback: 'Excellent service!',
        },
      ];
      setReferenceSessions(mockSessions);
    } catch (error) {
      console.error('Error loading reference sessions:', error);
    }
  }, []);

  useEffect(() => {
    loadReferenceSessions();
  }, [loadReferenceSessions]);

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      Alert.alert(
        'Limit Reached',
        'You have reached the maximum number of reference requests (3)'
      );
      return;
    }

    if (!formData.target_organization || !formData.message.trim()) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    const duplicate = referenceSessions.some(
      s =>
        s.status !== 'CANCELLED' &&
        s.status !== 'COMPLETED' &&
        s.session_type === 'PERSONAL_REFERENCE'
    );
    if (duplicate) {
      Alert.alert(
        'Duplicate',
        'You already have a pending reference request in progress'
      );
      return;
    }

    try {
      setIsLoading(true);

      // Mock API call - replace with actual implementation
      await new Promise<void>(resolve => {
        global.setTimeout(resolve, 1000);
      });

      Alert.alert('Success', 'Reference request submitted successfully!');
      setFormData({
        target_organization: '',
        specific_company: '',
        message: '',
        experience_level: '',
        target_role: '',
      });
      loadReferenceSessions();
    } catch (error) {
      console.error('Error requesting reference:', error);
      Alert.alert('Error', 'Failed to submit reference request');
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
      loadReferenceSessions();
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
      'Are you sure you want to cancel this reference request?',
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
              loadReferenceSessions();
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

  const selectedOrg = organizations.find(
    org => org.id === formData.target_organization
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Usage Tracker */}
        <View style={styles.usageTracker}>
          <Text style={styles.usageTitle}>
            Requests Used: {requestsUsed} / {MAX_REQUESTS}
          </Text>
          <Text style={styles.usageText}>
            You have {requestsRemaining} reference request
            {requestsRemaining !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Request Form */}
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={styles.formTitle}>Submit Reference Request</Text>
              <Text style={styles.formDescription}>
                Get connected to hiring managers and decision makers at your
                target organizations
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
                    You have reached the maximum number of reference requests
                    (3). Please wait for your current requests to be processed.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Target Organization */}
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>
                      Target Organization Type *
                    </Text>
                    <View style={styles.organizationSelector}>
                      {organizations.map((org, index) => (
                        <TouchableOpacity
                          key={org.id}
                          style={[
                            styles.organizationItem,
                            index === organizations.length - 1 &&
                              styles.organizationItemLast,
                          ]}
                          onPress={() =>
                            setFormData(prev => ({
                              ...prev,
                              target_organization: org.id,
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.organizationName,
                              {
                                color:
                                  formData.target_organization === org.id
                                    ? colors.primary
                                    : colors.text,
                              },
                            ]}
                          >
                            {org.name}
                          </Text>
                          <Text style={styles.organizationDescription}>
                            {org.description}
                          </Text>
                          <View style={styles.organizationCompanies}>
                            {org.companies.slice(0, 4).map(company => (
                              <View key={company} style={styles.companyBadge}>
                                <Text style={styles.companyBadgeText}>
                                  {company}
                                </Text>
                              </View>
                            ))}
                            {org.companies.length > 4 && (
                              <View style={styles.companyBadge}>
                                <Text style={styles.companyBadgeText}>
                                  +{org.companies.length - 4} more
                                </Text>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {selectedOrg && (
                    <View style={styles.selectedOrgInfo}>
                      <Text style={styles.selectedOrgTitle}>
                        Popular companies in this category:
                      </Text>
                      <View style={styles.selectedOrgCompanies}>
                        {selectedOrg.companies.map(company => (
                          <View key={company} style={styles.companyBadge}>
                            <Text style={styles.companyBadgeText}>
                              {company}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Specific Company */}
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>
                      Specific Company (Optional)
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Enter specific company name if you have a preference..."
                      placeholderTextColor={colors.inputPlaceholder}
                      value={formData.specific_company}
                      onChangeText={(text: string) =>
                        setFormData(prev => ({
                          ...prev,
                          specific_company: text,
                        }))
                      }
                    />
                  </View>

                  {/* Experience Level */}
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Your Experience Level</Text>
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
                    <Text style={styles.formLabel}>Target Role (Optional)</Text>
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

                  {/* Message */}
                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>
                      Your Background & Requirements *
                    </Text>
                    <TextInput
                      style={styles.formTextArea}
                      placeholder="Please describe your background, experience, and what you're looking for. Include any specific requirements or preferences..."
                      placeholderTextColor={colors.inputPlaceholder}
                      value={formData.message}
                      onChangeText={(text: string) =>
                        setFormData(prev => ({ ...prev, message: text }))
                      }
                      multiline
                    />
                    <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                      Tip: Include your domain expertise, career goals, and why
                      you&apos;re interested in this organization
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitRequest}
                    disabled={isLoading || requestsRemaining <= 0}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Submitting...' : 'Submit Reference Request'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Card>
          </View>

          {/* Service Details */}
          <View style={{ flex: 1 }}>
            <Card>
              <Text style={styles.serviceTitle}>What You Get</Text>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Direct Referrals</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Priority Consideration</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Insider Information</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={{ color: colors.success, fontSize: 12 }}>✓</Text>
                </View>
                <Text style={styles.featureText}>Network Access</Text>
              </View>

              <View style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>Pricing</Text>
                <Text style={styles.pricingAmount}>₹4,999</Text>
                <Text style={styles.pricingDescription}>per organization</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Previous Requests */}
        {referenceSessions.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.requestsTitle}>Your Reference Requests</Text>
            {referenceSessions.map(session => (
              <Card key={session.session_id}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestStatus}>
                    {getStatusBadge(session.status)}
                    <Text style={styles.requestDate}>
                      {session.created_at
                        ? new Date(session.created_at).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.requestActions}>
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

                <View style={styles.requestDetails}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      backgroundColor: colors.surfaceSecondary,
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      Request Details:
                    </Text>
                    {'\n'}
                    {session.notes}
                  </Text>
                </View>

                {session.status === 'COMPLETED' && !session.session_rating && (
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingTitle}>Rate this service</Text>
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
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
