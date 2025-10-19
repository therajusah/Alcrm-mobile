import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useResourceStore } from '../../stores/resourceStore';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import PDFViewer from '../../components/PDFViewer';
import type { FreeResource } from '../../types';

export default function ResourcesScreen() {
  const { resources, fetchResources, isLoading } = useResourceStore();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<FreeResource | null>(
    null
  );
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      color: colors.textSecondary,
      marginBottom: 16,
    },
    resourceCard: {
      marginBottom: 12,
    },
    resourceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    resourceDescription: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    resourceFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    resourceDate: {
      color: colors.textTertiary,
      fontSize: 12,
    },
    resourceActions: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    viewButton: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });

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
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Free Resources</Text>
        <Text style={styles.headerSubtitle}>
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
              <View style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                {resource.description && (
                  <Text style={styles.resourceDescription} numberOfLines={3}>
                    {resource.description}
                  </Text>
                )}
              </View>

              <View style={styles.resourceFooter}>
                {getResourceTypeBadge(resource.resource_type)}
                <Text style={styles.resourceDate}>
                  {new Date(resource.created_at || '').toLocaleDateString()}
                </Text>
              </View>

              {(resource.resource_url || resource.resource_link) && (
                <View style={styles.resourceActions}>
                  <Text style={styles.viewButton}>Tap to open →</Text>
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
