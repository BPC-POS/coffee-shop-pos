// context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Notification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  messageId?: string;
};

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: {
    title: string;
    body: string;
    messageId?: string;
  }) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse notifications from localStorage', e);
        }
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification: {
    title: string;
    body: string;
    messageId?: string;
  }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notification.title,
      body: notification.body,
      timestamp: Date.now(),
      read: false,
      messageId: notification.messageId,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};