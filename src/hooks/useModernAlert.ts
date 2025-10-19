import { useState } from 'react';

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
}

export const useModernAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (
    title: string,
    message: string,
    buttons: AlertButton[]
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return {
    showAlert,
    hideAlert,
    alertState,
  };
};

// Convenience functions for common alert patterns
export const createAlertHelpers = (
  showAlert: (title: string, message: string, buttons: AlertButton[]) => void
) => ({
  // Simple OK alert
  alert: (title: string, message: string, onPress?: () => void) => {
    showAlert(title, message, [
      {
        text: 'OK',
        onPress: onPress || (() => {}),
      },
    ]);
  },

  // Confirmation alert with Yes/No
  confirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showAlert(title, message, [
      {
        text: 'Cancel',
        onPress: onCancel || (() => {}),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: onConfirm,
        style: 'default',
      },
    ]);
  },

  // Destructive action confirmation
  confirmDestructive: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showAlert(title, message, [
      {
        text: 'Cancel',
        onPress: onCancel || (() => {}),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]);
  },

  // Success alert
  success: (title: string, message: string, onPress?: () => void) => {
    showAlert(title, message, [
      {
        text: 'Great!',
        onPress: onPress || (() => {}),
        style: 'default',
      },
    ]);
  },

  // Error alert
  error: (title: string, message: string, onPress?: () => void) => {
    showAlert(title, message, [
      {
        text: 'OK',
        onPress: onPress || (() => {}),
        style: 'destructive',
      },
    ]);
  },
});
