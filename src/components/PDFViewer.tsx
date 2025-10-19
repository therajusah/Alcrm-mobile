import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: 8,
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
    padding: 24,
  },
  loadingText: {
    color: '#4B5563',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingSubtext: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
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
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  errorActions: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  webViewContainer: {
    flex: 1,
    width,
    height: height - 80, // Account for header only
  },
});

export default function PDFViewer({
  visible,
  onClose,
  pdfUrl,
  title = 'PDF Document',
}: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null);

  console.log('PDFViewer props:', { visible, pdfUrl, title });


  // Try multiple PDF viewing approaches
  const getPDFSource = () => {
    // First try Google Docs Viewer
    if (pdfUrl.includes('http')) {
      return {
        uri: `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      };
    }
    return { uri: pdfUrl };
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
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <View style={styles.errorActions}>
                <Button title="Close" onPress={onClose} />
              </View>
            </View>
          ) : (
            <WebView
              source={getPDFSource()}
              style={styles.webViewContainer}
              onLoadStart={() => {
                console.log('PDF loading started:', pdfUrl);
                setError(null);
              }}
              onLoadEnd={() => {
                console.log('PDF loading ended');
              }}
              onError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
                setError(
                  'Failed to load PDF. You can download it instead.'
                );
              }}
              onHttpError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView HTTP error:', nativeEvent);
                setError(
                  'Failed to load PDF. Please check your internet connection.'
                );
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              mixedContentMode="compatibility"
              scalesPageToFit={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4F46E5" />
                  <Text style={styles.loadingText}>Loading PDF...</Text>
                  <Text style={styles.loadingSubtext}>
                    If this takes too long, try downloading instead
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
