import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { useResourceStore } from '../../stores/resourceStore';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import PDFViewer from '../../components/PDFViewer';
import type { FreeResource } from '../../types';

export default function ResourcesScreen() {
  const { resources, fetchResources, isLoading } = useResourceStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<FreeResource | null>(
    null
  );
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  useEffect(() => {
    fetchResources({ page: 1, pageSize: 50 });
  }, [fetchResources]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResources({ page: 1, pageSize: 50 });
    setRefreshing(false);
  };

  const handleViewResource = (resource: FreeResource) => {
    console.log('Viewing resource:', resource);
    if (resource.resource_url || resource.resource_link) {
      const url = resource.resource_url || resource.resource_link;
      console.log('Resource URL:', url);

      // Check if it's a PDF or other document type
      if (
        url &&
        (url.toLowerCase().includes('.pdf') || resource.resource_type === 'PDF')
      ) {
        console.log('Opening PDF viewer for:', url);
        setSelectedResource(resource);
        setShowPDFViewer(true);
      } else {
        Alert.alert(
          'External Resource',
          'This resource will open in your browser. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open',
              onPress: () => {
                // For non-PDF resources, you can still open in browser if needed
                Alert.alert(
                  'Info',
                  'This resource type is not supported for in-app viewing yet.'
                );
              },
            },
          ]
        );
      }
    }
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedResource(null);
  };

  const getResourceTypeBadge = (type: string | null) => {
    if (!type) return null;

    switch (type.toUpperCase()) {
      case 'PDF':
        return <Badge text="PDF" variant="danger" />;
      case 'VIDEO':
        return <Badge text="Video" variant="info" />;
      case 'ARTICLE':
        return <Badge text="Article" variant="success" />;
      case 'COURSE':
        return <Badge text="Course" variant="warning" />;
      default:
        return <Badge text={type} />;
    }
  };

  if (isLoading && !refreshing && resources.length === 0) {
    return <LoadingSpinner message="Loading resources..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          Free Resources
        </Text>
        <Text className="text-gray-600 mb-4">
          Access learning materials and guides
        </Text>

        {resources.length === 0 ? (
          <EmptyState
            title="No Resources Available"
            message="Check back later for new resources"
          />
        ) : (
          resources.map(resource => (
            <Card
              key={resource.resource_id}
              onPress={() => handleViewResource(resource)}
            >
              <View className="mb-3">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {resource.title}
                </Text>
                {resource.description && (
                  <Text className="text-gray-700 text-sm" numberOfLines={3}>
                    {resource.description}
                  </Text>
                )}
              </View>

              <View className="flex-row items-center justify-between">
                {getResourceTypeBadge(resource.resource_type)}
                <Text className="text-gray-500 text-xs">
                  {new Date(resource.created_at || '').toLocaleDateString()}
                </Text>
              </View>

              {(resource.resource_url || resource.resource_link) && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-primary-600 text-sm font-semibold">
                    Tap to open →
                  </Text>
                </View>
              )}
            </Card>
          ))
        )}
      </View>

      {/* PDF Viewer Modal */}
      {selectedResource && (
        <PDFViewer
          visible={showPDFViewer}
          onClose={closePDFViewer}
          pdfUrl={
            selectedResource.resource_url ||
            selectedResource.resource_link ||
            ''
          }
          title={selectedResource.title}
        />
      )}
    </ScrollView>
  );
}
