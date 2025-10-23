import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import type { RootStackParamList } from '../../types';

type PDFViewerScreenRouteProp = RouteProp<RootStackParamList, 'PDFViewer'>;

const PDFViewerScreen: React.FC = () => {
  const route = useRoute<PDFViewerScreenRouteProp>();
  const { pdfUrl, title = 'PDF Document' } = route.params;
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Download PDF locally for better WebView compatibility
  const downloadPdfLocally = async () => {
    try {
      console.log('Downloading PDF locally:', pdfUrl);
      const fileName = `pdf_${Date.now()}.pdf`;
      const localUri = `${FileSystem.cacheDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(pdfUrl, localUri);

      console.log('PDF downloaded successfully:', downloadResult.uri);
      setLocalPdfUri(downloadResult.uri);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF. Please try opening in browser.');
      setLoading(false);
    }
  };

  // Add timeout to prevent infinite loading
  useEffect(() => {
    // Start downloading PDF immediately
    downloadPdfLocally();

    const timeout = setTimeout(() => {
      if (loading) {
        console.log('PDF loading timeout reached');
        setError(
          'PDF is taking too long to load. Please try opening in browser.'
        );
        setLoading(false);
      }
    }, 15000); // 15 second timeout for download

    return () => clearTimeout(timeout);
  }, []);

  const handleLoadComplete = () => {
    console.log('PDF loaded successfully');
    setError(null);
    setLoading(false);
  };

  const handleError = (error: unknown) => {
    console.error('PDF Error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to load PDF. Please try opening in browser.';
    setError(errorMessage);
    setLoading(false);
  };

  const handleLoadStart = () => {
    console.log('WebView onLoadStart triggered - Network request initiated');
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log('Navigation state changed:', {
      url: navState.url,
      loading: navState.loading,
      title: navState.title,
    });
  };

  // Open PDF in default browser as fallback
  const openInBrowser = async () => {
    try {
      console.log('Opening PDF in browser:', pdfUrl);
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Error', 'Cannot open PDF in browser');
      }
    } catch (error) {
      console.error('Error opening PDF in browser:', error);
      Alert.alert('Error', 'Failed to open PDF in browser');
    }
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
      marginBottom: 20,
    },
    progressText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    retryButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    browserButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    browserButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    pdfContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Downloading PDF...</Text>
          {downloadProgress > 0 && (
            <Text style={styles.progressText}>
              {downloadProgress.toFixed(1)}% complete
            </Text>
          )}
          <TouchableOpacity
            style={styles.browserButton}
            onPress={openInBrowser}
          >
            <Text style={styles.browserButtonText}>
              Open in Browser Instead
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              setDownloadProgress(0);
              downloadPdfLocally();
            }}
          >
            <Text style={styles.retryButtonText}>Retry Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.browserButton}
            onPress={openInBrowser}
          >
            <Text style={styles.browserButtonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        <WebView
          source={{ uri: localPdfUri || pdfUrl }}
          style={styles.pdfContainer}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadComplete}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={true}
          allowsBackForwardNavigationGestures={false}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
          onShouldStartLoadWithRequest={request => {
            console.log('WebView should start load request:', request.url);
            return true;
          }}
          onHttpError={event => {
            console.error('HTTP Error:', event.nativeEvent.statusCode);
            handleError(`HTTP Error: ${event.nativeEvent.statusCode}`);
          }}
          onMessage={event => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
          injectedJavaScript={`
            console.log('WebView JavaScript injected');
            window.addEventListener('load', function() {
              console.log('WebView page loaded');
            });
            true;
          `}
        />
      </View>
    </View>
  );
};

export default PDFViewerScreen;
