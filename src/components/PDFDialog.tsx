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
import { useTheme } from '../contexts/ThemeContext';

interface PDFDialogProps {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const { width, height } = Dimensions.get('window');

export default function PDFDialog({
  visible,
  onClose,
  pdfUrl,
  title = 'PDF Document',
}: PDFDialogProps) {
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);

  console.log('PDFDialog props:', { visible, pdfUrl, title });

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    closeButton: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 9999,
    },
    closeButtonText: {
      color: colors.textSecondary,
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
      color: colors.textSecondary,
      marginTop: 16,
      fontSize: 16,
      fontWeight: '500',
    },
    loadingSubtext: {
      color: colors.textTertiary,
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
      color: colors.error,
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
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={onClose}
                >
                  <Text style={{ color: colors.textInverse, fontWeight: '600' }}>
                    Close
                  </Text>
                </TouchableOpacity>
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
                  <ActivityIndicator size="large" color={colors.primary} />
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