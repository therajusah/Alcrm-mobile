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
  webViewContainer: {
    flex: 1,
    width,
    height: height - 120, // Account for header and buttons
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
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
          <Text
            className="text-lg font-semibold text-gray-900 flex-1"
            numberOfLines={1}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="ml-4 p-2 bg-gray-200 rounded-full"
          >
            <Text className="text-gray-600 font-bold text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1">
          {isLoading && (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-600 mt-4">Loading PDF...</Text>
            </View>
          )}

          {error && (
            <View className="flex-1 items-center justify-center p-6">
              <Text className="text-red-600 text-center mb-4">{error}</Text>
              <Button title="Close" onPress={onClose} />
            </View>
          )}

          {!isLoading && !error && (
            <View className="flex-1">
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
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text className="mt-4 text-gray-600">Loading PDF...</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {!isLoading && !error && (
          <View className="flex-row justify-around p-4 bg-gray-50 border-t border-gray-200">
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
