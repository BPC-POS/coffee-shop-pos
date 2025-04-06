"use client";

import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
// import { useNotifications } from '@/context/NotificationContext';
import { getMessaging, onMessage } from 'firebase/messaging';
// Import directly from the hooks directory without the @ alias
import { getClientMessaging, subscribeToMessages } from '../../hooks/firebaseClient';

// Temporary local definitions for notifications until we set up the proper context
type Notification = {
  messageId?: string;
  title?: string;
  body?: string;
};

// Temporary hook until we properly set up the NotificationContext
const useNotifications = () => {
  const addNotification = (notification: Notification) => {
    console.log('New notification:', notification);
    // Show an alert for now
    if (notification.title && notification.body) {
      alert(`${notification.title}: ${notification.body}`);
    }
  };

  return { addNotification };
};

export default function FirebaseMessagingListener() {
  const { addNotification } = useNotifications();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Set up Firebase Messaging
    const setupMessaging = async () => {
      try {
        // Subscribe to foreground messages
        const unsubscribe = await subscribeToMessages((payload) => {
          console.log('Received foreground message:', payload);
          if (payload.notification) {
            addNotification({
              messageId: payload.messageId,
              title: payload.notification.title,
              body: payload.notification.body
            });
          }
        });

        if (unsubscribe) {
          unsubscribeRef.current = unsubscribe;
        }

        // Create BroadcastChannel for background messages
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          channelRef.current = new BroadcastChannel('firebase-messaging-background');
          channelRef.current.onmessage = (event) => {
            console.log('Received background message via broadcast channel:', event.data);
            if (event.data?.notification) {
              addNotification({
                messageId: event.data.messageId,
                title: event.data.notification.title,
                body: event.data.notification.body
              });
            }
          };
        }
      } catch (error) {
        console.error('Error setting up Firebase Messaging:', error);
      }
    };

    setupMessaging();

    // Cleanup function
    return () => {
      // Unsubscribe from Firebase messaging
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      // Close broadcast channel
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, []);

  return <View />; // Empty component
}