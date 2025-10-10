import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Button from './Button';

interface PDFViewerProps {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

export default function PDFViewer({
  visible,
  onClose,
  pdfUrl,
  title = 'PDF Document',
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPath, setLocalPath] = useState<string | null>(null);

  const downloadAndCachePDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if FileSystem is available
      if (!FileSystem.documentDirectory) {
        throw new Error('File system not available');
      }

      // Create a local filename
      const filename = `resource_${Date.now()}.pdf`;
      const localUri = FileSystem.documentDirectory + filename;

      // Download the PDF
      const downloadResult = await FileSystem.downloadAsync(pdfUrl, localUri);

      if (downloadResult.status === 200) {
        setLocalPath(downloadResult.uri);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (err) {
      console.error('PDF download error:', err);
      setError('Failed to load PDF. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [pdfUrl]);

  React.useEffect(() => {
    if (visible && pdfUrl) {
      downloadAndCachePDF();
    }
  }, [visible, pdfUrl, downloadAndCachePDF]);

  const handleShare = async () => {
    if (!localPath) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(localPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share PDF',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (err) {
      console.error('Share error:', err);
      Alert.alert('Error', 'Failed to share PDF');
    }
  };

  const handleDownload = async () => {
    if (!localPath) return;

    try {
      // Check if FileSystem is available
      if (!FileSystem.documentDirectory) {
        Alert.alert('Error', 'File system not available');
        return;
      }

      const filename = `ALCRM_Resource_${Date.now()}.pdf`;
      const documentsDir = FileSystem.documentDirectory;
      const destinationUri = `${documentsDir}${filename}`;

      await FileSystem.copyAsync({
        from: localPath,
        to: destinationUri,
      });

      Alert.alert('Download Complete', `PDF saved to: ${destinationUri}`, [
        { text: 'OK' },
      ]);
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
              <Button title="Retry" onPress={downloadAndCachePDF} />
            </View>
          )}

          {localPath && !isLoading && !error && (
            <View className="flex-1">
              <View className="flex-1 items-center justify-center p-6">
                <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  PDF Document Ready
                </Text>
                <Text className="text-gray-600 text-center mb-6">{title}</Text>
                <View className="space-y-4 w-full">
                  <Button
                    title="Open in Browser"
                    onPress={() => Linking.openURL(pdfUrl)}
                    className="w-full"
                  />
                  <Button
                    title="Share PDF"
                    onPress={handleShare}
                    variant="outline"
                    className="w-full"
                  />
                  <Button
                    title="Download PDF"
                    onPress={handleDownload}
                    variant="outline"
                    className="w-full"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {localPath && !isLoading && !error && (
          <View className="flex-row justify-around p-4 bg-gray-50 border-t border-gray-200">
            <Button
              title="Share"
              onPress={handleShare}
              variant="outline"
              className="flex-1 mr-2"
            />
            <Button
              title="Download"
              onPress={handleDownload}
              variant="outline"
              className="flex-1 ml-2"
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
