import React, { useState, useRef } from 'react';
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

interface SecurePDFViewerProps {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
  },
  webViewContainer: {
    flex: 1,
    width,
    height: height - 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 16,
  },
  securityNotice: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  securityText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default function SecurePDFViewer({
  visible,
  onClose,
  pdfUrl,
  title = 'Secure PDF Document',
}: SecurePDFViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [showSecurityNotice, setShowSecurityNotice] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Hide security notice after 3 seconds
  React.useEffect(() => {
    if (visible && showSecurityNotice) {
      const timer = setTimeout(() => {
        setShowSecurityNotice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, showSecurityNotice]);

  // Reset states when modal opens
  React.useEffect(() => {
    if (visible) {
      setError(null);
      setShowSecurityNotice(true);
    }
  }, [visible]);

  const handleWebViewMessage = (event: any) => {
    // Block any attempts to access external URLs or download
    const message = event.nativeEvent.data;
    if (message && typeof message === 'string') {
      if (message.includes('download') || message.includes('share') || message.includes('external')) {
        console.log('Blocked external access attempt:', message);
        return;
      }
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    // Block navigation to external URLs
    const url = request.url;
    if (url && !url.includes(pdfUrl) && !url.includes('docs.google.com/viewer')) {
      console.log('Blocked external navigation:', url);
      return false;
    }
    return true;
  };

  const handleLoadStart = () => {
    console.log('Secure PDF loading started:', pdfUrl);
    setError(null);
  };

  const handleLoadEnd = () => {
    console.log('Secure PDF loading completed');
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Secure PDF WebView error:', nativeEvent);
    setError('Failed to load PDF securely. Please try again.');
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('Secure PDF HTTP error:', nativeEvent);
    setError('Network error. Please check your connection.');
  };

  // Enhanced JavaScript injection to completely block all external access
  const injectedJavaScript = `
    (function() {
      // Disable right-click context menu
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Disable text selection
      document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Disable drag and drop
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Disable keyboard shortcuts for save/print
      document.addEventListener('keydown', function(e) {
        // Block Ctrl+S (save), Ctrl+P (print), Ctrl+A (select all)
        if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) {
          e.preventDefault();
          return false;
        }
        // Block F12 (dev tools)
        if (e.key === 'F12') {
          e.preventDefault();
          return false;
        }
      });
      
      // Remove any download buttons or links
      const downloadElements = document.querySelectorAll('a[href*="download"], button[onclick*="download"]');
      downloadElements.forEach(el => el.remove());
      
      // Hide any share buttons
      const shareElements = document.querySelectorAll('[class*="share"], [id*="share"]');
      shareElements.forEach(el => el.style.display = 'none');
      
      // Remove "Go to Web" or external link buttons
      const externalElements = document.querySelectorAll('a[href*="http"], button[onclick*="window.open"], [class*="external"], [class*="web"], [class*="browser"]');
      externalElements.forEach(el => el.remove());
      
      // Hide any toolbar or action buttons
      const toolbarElements = document.querySelectorAll('[class*="toolbar"], [class*="action"], [class*="menu"], [class*="button"]');
      toolbarElements.forEach(el => {
        if (el.textContent && (el.textContent.includes('Share') || el.textContent.includes('Download') || el.textContent.includes('Web') || el.textContent.includes('Open'))) {
          el.style.display = 'none';
        }
      });
      
      // Remove any iframe or embed elements that might contain external content
      const iframeElements = document.querySelectorAll('iframe, embed, object');
      iframeElements.forEach(el => el.remove());
      
      // Block any attempts to open new windows
      window.open = function() { return null; };
      
      // Override any external navigation
      document.addEventListener('click', function(e) {
        const target = e.target;
        if (target && target.href && target.href.startsWith('http')) {
          e.preventDefault();
          return false;
        }
      });
      
      // Remove any elements with "Go to Web" text
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent && el.textContent.includes('Go to Web')) {
          el.style.display = 'none';
        }
      });
      
      console.log('Enhanced security measures applied to PDF viewer');
    })();
    true;
  `;

  // Use Google Docs Viewer for secure PDF rendering with minimal UI
  const getPDFSource = () => {
    if (pdfUrl.includes('http')) {
      return {
        uri: `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true&chrome=false&widget=false&toolbar=false&navpanes=false&scrollbar=false&statusbar=false&messages=false&scrollbar=false&print=false&download=false`
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

        {/* Security Notice */}
        {showSecurityNotice && (
          <View style={styles.securityNotice}>
            <Text style={styles.securityText}>
              🔒 Secure Viewing Mode - Download and sharing disabled
            </Text>
          </View>
        )}

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
              ref={webViewRef}
              source={getPDFSource()}
              style={styles.webViewContainer}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onHttpError={handleHttpError}
              onMessage={handleWebViewMessage}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              javaScriptEnabled={true}
              domStorageEnabled={false} // Disable local storage
              thirdPartyCookiesEnabled={false} // Disable third-party cookies
              mixedContentMode="never" // Block mixed content
              startInLoadingState={true}
              scalesPageToFit={true}
              allowsInlineMediaPlayback={false} // Disable media playback
              mediaPlaybackRequiresUserAction={true}
              allowsFullscreenVideo={false}
              allowsBackForwardNavigationGestures={false}
              bounces={false}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              injectedJavaScript={injectedJavaScript}
              injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
              onNavigationStateChange={(navState) => {
                // Block any navigation attempts
                if (navState.url !== pdfUrl && !navState.url.includes('docs.google.com/viewer')) {
                  console.log('Blocked navigation to:', navState.url);
                  return false;
                }
                return true;
              }}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4F46E5" />
                  <Text style={styles.loadingText}>Loading PDF securely...</Text>
                  <Text style={styles.loadingSubtext}>
                    Download and sharing features are disabled for security
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