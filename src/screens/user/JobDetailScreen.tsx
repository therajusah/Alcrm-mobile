import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput } from 'react-native';
import { useJobStore } from '../../stores/jobStore';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function JobDetailScreen({ route, navigation }: any) {
  const { jobId } = route.params;
  const { selectedJob, fetchJobDetail, applyForJob, isLoading } = useJobStore();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetail(jobId);

    return () => {
      // Clean up when leaving screen
    };
  }, [jobId, fetchJobDetail]);

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      Alert.alert('Required', 'Please write a cover letter');
      return;
    }

    setApplying(true);
    try {
      await applyForJob(jobId, coverLetter);
      Alert.alert('Success', 'Application submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
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
    return <LoadingSpinner message="Loading job details..." />;
  }

  const hasApplied =
    selectedJob.applicationStatus !== undefined &&
    selectedJob.applicationStatus !== null &&
    selectedJob.applicationStatus.hasApplied === true;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-6">
        {/* Job Header */}
        <Card>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {selectedJob.title}
          </Text>

          {selectedJob.company_name && (
            <Text className="text-lg text-gray-600 mb-4">
              {selectedJob.company_name}
            </Text>
          )}

          <View className="flex-row flex-wrap items-center gap-2 mb-4">
            {getJobTypeBadge(selectedJob.type)}
            {getStatusBadge(selectedJob.status)}
          </View>

          <View className="border-t border-gray-200 pt-4 mt-2">
            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">📍 Location</Text>
              <Text className="text-gray-900 font-semibold">
                {selectedJob.location}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">💰 Salary</Text>
              <Text className="text-gray-900 font-semibold">
                {selectedJob.salary}
              </Text>
            </View>

            <View>
              <Text className="text-gray-600 text-sm mb-1">📅 Posted</Text>
              <Text className="text-gray-900 font-semibold">
                {new Date(selectedJob.postedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Job Description */}
        <Card title="Job Description">
          <Text className="text-gray-700 leading-6">
            {selectedJob.description}
          </Text>
        </Card>

        {/* Application Status or Apply Form */}
        {hasApplied ? (
          <Card>
            <View className="items-center py-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Application Status
              </Text>
              <Badge
                text="Applied"
                variant="info"
                className="px-4 py-2"
              />
              <Text className="text-gray-600 mt-4 text-center">
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
                <Text className="text-gray-700 mb-3">
                  Write a brief cover letter explaining why you&apos;re a good
                  fit for this role:
                </Text>

                <TextInput
                  className="border border-gray-300 rounded-lg p-4 mb-4 text-gray-900 bg-white min-h-[120px]"
                  placeholder="Dear Hiring Manager,..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={coverLetter}
                  onChangeText={setCoverLetter}
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Button
                      title="Cancel"
                      onPress={() => setShowApplyForm(false)}
                      variant="outline"
                      disabled={applying}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      title="Submit"
                      onPress={handleApply}
                      loading={applying}
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
