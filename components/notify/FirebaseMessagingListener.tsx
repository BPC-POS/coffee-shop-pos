"use client";

import { useEffect, useRef } from 'react'; 
import { getClientMessaging, subscribeToMessages } from '@/hooks/firebaseClient';
// We'll define interfaces locally for now
// import { useNotifications } from '@/context/NotificationContext';

// Define notification type
type Notification = {
  messageId?: string;
  title: string;
  body: string;
};

// Temporary hook for demonstration
const useNotifications = () => {
  const addNotification = (notification: Notification) => {
    console.log('New notification:', notification);
    // You can replace this with actual notification display logic
    if (typeof window !== 'undefined') {
      alert(`${notification.title}: ${notification.body}`);
    }
  };
  
  return { addNotification };
};

let notificationChannel: BroadcastChannel | null = null;

const FirebaseMessagingListener = () => {
  const { addNotification } = useNotifications();
  const addNotificationRef = useRef(addNotification);
  
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    let unsubscribeForeground: (() => void) | null = null;

    const initializeMessaging = async () => {
      try {
        // Subscribe to messages using the function from firebaseClient
        unsubscribeForeground = await subscribeToMessages((payload) => {
          console.log('Foreground Message received:', payload);
          if (payload.notification) {
            addNotificationRef.current({
              messageId: payload.messageId,
              title: payload.notification.title || 'Thông báo',
              body: payload.notification.body || 'Bạn có tin nhắn mới.',
            });
          }
        });
        
        if (!unsubscribeForeground) {
          console.log("Firebase Messaging không khả dụng.");
        }
      } catch (error) {
        console.error("Error initializing messaging:", error);
      }
    };

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        notificationChannel = new BroadcastChannel('fcm-notifications');
        console.log("Broadcast Channel 'fcm-notifications' created.");
      } catch (error) {
        console.error("Error creating broadcast channel:", error);
      }
    }

    const handleChannelMessage = (event: MessageEvent) => {
      console.log("Broadcast Channel message received:", event.data);
      if (event.data && event.data.type === 'NEW_NOTIFICATION' && event.data.payload) {
        addNotificationRef.current({
          messageId: event.data.payload.messageId,
          title: event.data.payload.title,
          body: event.data.payload.body,
        });
      }
    };

    if (notificationChannel) {
      notificationChannel.addEventListener('message', handleChannelMessage);
      console.log("Broadcast Channel listener added.");
    }

    // Execute initializeMessaging and handle cleanup
    initializeMessaging().catch(console.error);

    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
        console.log("Foreground listener unsubscribed.");
      }
      if (notificationChannel) {
        notificationChannel.removeEventListener('message', handleChannelMessage);
        console.log("Broadcast Channel listener removed.");
      }
    };
  }, []);

  return null;
};

export default FirebaseMessagingListener;