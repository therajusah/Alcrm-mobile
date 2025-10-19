import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Button from './Button';

interface PDFViewerProps {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
  },
  closeButtonText: {
    color: '#4B5563',
    fontWeight: 'bold',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#4B5563',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  webViewContainer: {
    flex: 1,
    width,
    height: height - 120, // Account for header and buttons
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

export default function PDFViewer({
  visible,
  onClose,
  pdfUrl,
  title = 'PDF Document',
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('PDFViewer props:', { visible, pdfUrl, title });

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Download the PDF first, then share
        const filename = `ALCRM_Resource_${Date.now()}.pdf`;
        const localUri = `file:///tmp/${filename}`;

        const downloadResult = await FileSystem.downloadAsync(pdfUrl, localUri);
        if (downloadResult.status === 200) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share PDF',
          });
        } else {
          throw new Error('Failed to download PDF for sharing');
        }
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (err) {
      console.error('Share error:', err);
      Alert.alert('Error', 'Failed to share PDF');
    }
  };

  const handleDownload = async () => {
    try {
      // Check if FileSystem is available
      if (!FileSystem.documentDirectory) {
        Alert.alert('Error', 'File system not available');
        return;
      }

      const filename = `ALCRM_Resource_${Date.now()}.pdf`;
      const documentsDir = FileSystem.documentDirectory;
      const destinationUri = `${documentsDir}${filename}`;

      // Download directly from URL to documents directory
      const downloadResult = await FileSystem.downloadAsync(
        pdfUrl,
        destinationUri
      );

      if (downloadResult.status === 200) {
        Alert.alert('Download Complete', `PDF saved to: ${destinationUri}`, [
          { text: 'OK' },
        ]);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Error', 'Failed to download PDF');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Close" onPress={onClose} />
            </View>
          )}

          {!isLoading && !error && (
            <View style={styles.content}>
              <WebView
                source={{
                  uri: pdfUrl,
                  headers: {
                    Accept: 'application/pdf',
                  },
                }}
                style={styles.webViewContainer}
                onLoadStart={() => {
                  setIsLoading(true);
                  setError(null);
                }}
                onLoadEnd={() => setIsLoading(false)}
                onError={syntheticEvent => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('WebView error:', nativeEvent);
                  setError(
                    'Failed to load PDF. Please try downloading instead.'
                  );
                  setIsLoading(false);
                }}
                onHttpError={syntheticEvent => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('WebView HTTP error:', nativeEvent);
                  setError(
                    'Failed to load PDF. Please check your internet connection.'
                  );
                  setIsLoading(false);
                }}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                mixedContentMode="compatibility"
                thirdPartyCookiesEnabled={false}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Loading PDF...</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {!isLoading && !error && (
          <View style={styles.actionButtons}>
            <Button title="Share" onPress={handleShare} variant="outline" />
            <Button
              title="Download"
              onPress={handleDownload}
              variant="outline"
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
