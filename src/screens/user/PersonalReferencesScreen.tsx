import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { useModernAlert } from '../../hooks/useModernAlert';
import ModernAlert from '../../components/ModernAlert';
import { userApi } from '../../services/api';

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
  const { showAlert, hideAlert, alertState } = useModernAlert();
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
  const [dropdownVisible, setDropdownVisible] = useState({
    organization: false,
    experience: false,
    role: false,
  });

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
      backgroundColor: `${colors.info}15`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: `${colors.info}30`,
    },
    usageTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.info,
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
    formSection: {
      marginBottom: 24,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    formInput: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formTextArea: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      minHeight: 120,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: colors.border,
    },
    organizationSelector: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    organizationItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
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
      marginBottom: 6,
    },
    organizationDescription: {
      fontSize: 14,
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
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    companyBadgeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    selectedOrgInfo: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
      paddingVertical: 18,
      borderRadius: 30,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.info,
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
      backgroundColor: `${colors.info}15`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: `${colors.info}30`,
    },
    pricingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.info,
      marginBottom: 8,
    },
    pricingAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.info,
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
    selectorItem: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectorItemLast: {
      borderBottomWidth: 0,
    },
    selectorText: {
      fontSize: 16,
      color: colors.text,
    },
    selectorTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    tipText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontStyle: 'italic',
      marginTop: 4,
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
    dropdownContainer: {
      position: 'relative',
    },
    dropdownButton: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownButtonPlaceholder: {
      fontSize: 16,
      color: colors.inputPlaceholder,
    },
    dropdownArrow: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    dropdownModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownContent: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      marginHorizontal: 20,
      maxHeight: 400,
      width: '90%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    dropdownItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemLast: {
      borderBottomWidth: 0,
    },
    dropdownItemText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownItemSelected: {
      backgroundColor: `${colors.primary}10`,
    },
    dropdownItemTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    dropdownCloseButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      margin: 20,
      alignItems: 'center',
    },
    dropdownCloseButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const MAX_REQUESTS = 3;
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
      // Load personal reference sessions from API
      const response = await userApi.getMySessions({
        session_type: 'PERSONAL_REFERENCE',
        page: 1,
        pageSize: 50,
      });
      
      // Transform the response to match our interface
      const sessions = response.items.map(session => {
        // Parse the notes field to extract personal reference data
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
          notes: session.notes,
          session_rating: session.session_rating,
          session_feedback: session.session_feedback,
          target_organization: parsedNotes.target_organization,
          specific_company: parsedNotes.specific_company,
          experience_level: parsedNotes.experience_level,
          target_role: parsedNotes.target_role,
          message: parsedNotes.message,
          mentor_notes: session.mentor_notes,
        };
      });
      
      setReferenceSessions(sessions);
    } catch (error) {
      console.error('Error loading reference sessions:', error);
      // Fallback to empty array if API fails
      setReferenceSessions([]);
    }
  }, []);

  useEffect(() => {
    loadReferenceSessions();
  }, [loadReferenceSessions]);

  const handleSubmitRequest = async () => {
    if (requestsRemaining <= 0) {
      showAlert(
        'Limit Reached',
        'You have reached the maximum number of reference requests (3)',
        [
          {
            text: 'OK',
            onPress: hideAlert,
          },
        ]
      );
      return;
    }

    if (!formData.target_organization || !formData.message.trim()) {
      showAlert('Required', 'Please fill in all required fields', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
      return;
    }

    const duplicate = referenceSessions.some(
      s =>
        s.status !== 'CANCELLED' &&
        s.status !== 'COMPLETED' &&
        s.session_type === 'PERSONAL_REFERENCE'
    );
    if (duplicate) {
      showAlert(
        'Duplicate',
        'You already have a pending reference request in progress',
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

      // Submit personal reference request via API
      await userApi.bookSession({
        session_type: 'PERSONAL_REFERENCE',
        notes: JSON.stringify({
          target_organization: formData.target_organization,
          specific_company: formData.specific_company,
          experience_level: formData.experience_level,
          target_role: formData.target_role,
          message: formData.message,
        }),
      });

      showAlert('Success', 'Reference request submitted successfully!', [
        {
          text: 'OK',
          onPress: hideAlert,
        },
      ]);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit reference request';
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
      loadReferenceSessions();
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
      'Are you sure you want to cancel this reference request?',
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
              setReferenceSessions(prev => 
                prev.map(session => 
                  session.session_id === sessionId 
                    ? { ...session, status: 'CANCELLED' }
                    : session
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

  const selectedOrg = organizations.find(
    org => org.id === formData.target_organization
  );

  const DropdownComponent = ({ 
    label, 
    placeholder, 
    options, 
    selectedValue, 
    onSelect, 
    isVisible, 
    onClose,
    renderItem 
  }: {
    label: string;
    placeholder: string;
    options: any[];
    selectedValue: string;
    onSelect: (value: string) => void;
    isVisible: boolean;
    onClose: () => void;
    renderItem?: (item: any, isSelected: boolean) => React.ReactNode;
  }) => {
    const selectedOption = options.find(opt => opt.id === selectedValue || opt === selectedValue);
    
    return (
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => onClose()}
        >
          <Text style={selectedOption ? styles.dropdownButtonText : styles.dropdownButtonPlaceholder}>
            {selectedOption ? (selectedOption.name || selectedOption) : placeholder}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={isVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={onClose}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownContent}>
              <ScrollView>
                {options.map((option, index) => {
                  const isSelected = (option.id || option) === selectedValue;
                  return (
                    <TouchableOpacity
                      key={option.id || index}
                      style={[
                        styles.dropdownItem,
                        index === options.length - 1 && styles.dropdownItemLast,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        onSelect(option.id || option);
                        onClose();
                      }}
                    >
                      {renderItem ? renderItem(option, isSelected) : (
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}>
                          {option.name || option}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity style={styles.dropdownCloseButton} onPress={onClose}>
                <Text style={styles.dropdownCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
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
            You have {requestsRemaining} reference request
            {requestsRemaining !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        {/* Request Form */}
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
              <DropdownComponent
                label="Target Organization Type *"
                placeholder="Select Organization Type"
                options={organizations}
                selectedValue={formData.target_organization}
                onSelect={(value) => setFormData(prev => ({ ...prev, target_organization: value }))}
                isVisible={dropdownVisible.organization}
                onClose={() => setDropdownVisible(prev => ({ ...prev, organization: !prev.organization }))}
                renderItem={(org, isSelected) => (
                  <View>
                    <Text style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextSelected,
                    ]}>
                      {org.name}
                    </Text>
                    <Text style={[styles.organizationDescription, { marginTop: 4 }]}>
                      {org.description}
                    </Text>
                    <View style={styles.organizationCompanies}>
                      {org.companies.slice(0, 3).map((company: string) => (
                        <View key={company} style={styles.companyBadge}>
                          <Text style={styles.companyBadgeText}>
                            {company}
                          </Text>
                        </View>
                      ))}
                      {org.companies.length > 3 && (
                        <View style={styles.companyBadge}>
                          <Text style={styles.companyBadgeText}>
                            +{org.companies.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              />

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
              <DropdownComponent
                label="Your Experience Level"
                placeholder="Select Experience Level"
                options={experienceLevels}
                selectedValue={formData.experience_level}
                onSelect={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                isVisible={dropdownVisible.experience}
                onClose={() => setDropdownVisible(prev => ({ ...prev, experience: !prev.experience }))}
              />

              {/* Target Role */}
              <DropdownComponent
                label="Target Role (Optional)"
                placeholder="Select Target Role"
                options={targetRoles}
                selectedValue={formData.target_role}
                onSelect={(value) => setFormData(prev => ({ ...prev, target_role: value }))}
                isVisible={dropdownVisible.role}
                onClose={() => setDropdownVisible(prev => ({ ...prev, role: !prev.role }))}
              />

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
                <Text style={styles.tipText}>
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

        {/* Service Details */}
        <Card>
          <Text style={styles.serviceTitle}>What You Get</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Direct Referrals</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Priority Consideration</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Insider Information</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ color: colors.success, fontSize: 10 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>Network Access</Text>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>Pricing</Text>
            <Text style={styles.pricingAmount}>₹4,999</Text>
            <Text style={styles.pricingDescription}>per organization</Text>
          </View>
        </Card>

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
                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackTitle}>Request Details:</Text>
                    <Text style={styles.feedbackText}>
                      {session.notes}
                    </Text>
                  </View>
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
