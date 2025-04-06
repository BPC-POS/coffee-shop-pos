"use client";

import { useEffect, useState } from 'react';
import { requestPermission, subscribeToMessages } from '@/hooks/firebaseClient';
import { Alert } from 'react-native';

export default function NotificationHandler() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      // Request permission and get token
      const token = await requestPermission();
      
      if (token) {
        // Send token to your backend
        try {
          const response = await fetch('YOUR_API_ENDPOINT/register-device', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          if (response.ok) {
            console.log('Device token registered with backend');
            setIsReady(true);
          }
        } catch (error) {
          console.error('Failed to register device token with backend:', error);
        }
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    let unsubscribeFunction: (() => void) | null = null;

    // Subscribe to FCM messages
    subscribeToMessages((payload) => {
      if (payload.notification) {
        Alert.alert(
          payload.notification.title || 'New Notification',
          payload.notification.body || 'You have a new notification',
          [{ text: 'OK' }]
        );
      }
    }).then(unsubFn => {
      unsubscribeFunction = unsubFn;
    });

    return () => {
      if (unsubscribeFunction) unsubscribeFunction();
    };
  }, [isReady]);

  return null;
} 