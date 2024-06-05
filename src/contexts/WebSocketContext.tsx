import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './authContext';
import { NotificationType, AuthorType, StayDataType, ReviewDTO } from '@/data/types';
import { fetchNotifications, markNotificationAsRead, deleteNotificationsForAuthor, markAllNotificationsAsRead } from '@/api/notifications';

interface WebSocketContextType {
  notifications: NotificationType[];
  fetchInitialNotifications: (authorId: number) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (authorId: number) => void;
  clearNotifications: (authorId: number) => void;
  handleBroadcastMessage: (message: BroadcastMessage) => void;
  authors: Record<number, AuthorType>;
  stayListings: Record<number, StayDataType>;
  reviews: Record<number, ReviewDTO[]>;
}

interface BroadcastMessage {
  type: string;
  payload: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [authors, setAuthors] = useState<Record<number, AuthorType>>({});
  const [stayListings, setStayListings] = useState<Record<number, StayDataType>>({});
  const [reviews, setReviews] = useState<Record<number, ReviewDTO[]>>({});
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!user || stompClient) return;
  
    const token = sessionStorage.getItem('token');
  
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      // debug: function (str) {
      //   console.log('STOMP: ' + str);
      // },
    });
  
    client.onConnect = (frame) => {
      // console.log('Connected: ' + frame);
      client.subscribe(`/topic/notifications/${user.id}`, (message: Message) => {
        const notification = JSON.parse(message.body) as NotificationType;
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      });
  
      client.subscribe(`/topic/changes`, (message: Message) => {
        const broadcastMessage = JSON.parse(message.body) as BroadcastMessage;
        handleBroadcastMessage(broadcastMessage);
      });
    };
  
    // client.onStompError = (frame) => {
    //   console.error('Broker reported error: ' + frame.headers['message']);
    //   console.error('Additional details: ' + frame.body);
    // };
  
    // client.onWebSocketError = (event) => {
    //   console.error('WebSocket error:', event);
    // };
  
    // client.onWebSocketClose = (event) => {
    //   console.error('WebSocket closed:', event);
    // };
  
    client.activate();
    setStompClient(client);
  
    return () => {
      if (client) {
        client.deactivate();
        // console.log('WebSocket connection deactivated.');
      }
    };
  }, [user]);

  const fetchInitialNotifications = useCallback(async (authorId: number) => {
    try {
      const fetchedNotifications = await fetchNotifications(authorId);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Failed to fetch initial notifications:", error);
    }
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async (authorId: number) => {
    try {
      await markAllNotificationsAsRead(authorId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearNotifications = async (authorId: number) => {
    try {
      await deleteNotificationsForAuthor(authorId);
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  const handleBroadcastMessage = (message: BroadcastMessage) => {
    console.log('Received broadcast message:', message);
    switch (message.type) {
      case 'NEW_AUTHOR':
      case 'UPDATED_AVATAR':
      case 'UPDATED_AUTHOR':
        setAuthors((prevAuthors) => ({
          ...prevAuthors,
          [message.payload.id]: message.payload,
        }));
        if (message.payload.id === user?.id) {
          setUser(message.payload);
          sessionStorage.setItem('user', JSON.stringify(message.payload));
        }
        break;
      case 'DELETED_AUTHOR':
        setAuthors((prevAuthors) => {
          const newAuthors = { ...prevAuthors };
          delete newAuthors[message.payload];
          return newAuthors;
        });
        if (message.payload === user?.id) {
          setUser(null);
          sessionStorage.removeItem('user');
        }
        break;
      case 'NEW_STAY_LISTING':
        setStayListings((prevListings) => ({
          ...prevListings,
          [message.payload.id]: message.payload,
        }));
        break;
      case 'DELETED_STAY_LISTING':
        setStayListings((prevListings) => {
          const newListings = { ...prevListings };
          delete newListings[message.payload];
          return newListings;
        });
        break;
        case 'NEW_REVIEW':
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews };
        if (!newReviews[message.payload.stayListingId]) {
          newReviews[message.payload.stayListingId] = [];
        }
        const reviewExists = newReviews[message.payload.stayListingId].some(
          (review) => review.id === message.payload.id
        );
        if (!reviewExists) {
          newReviews[message.payload.stayListingId].push(message.payload);
        }
        return newReviews;
      });
      break;
    case 'UPDATED_REVIEW':
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews };
        if (!newReviews[message.payload.stayListingId]) {
          newReviews[message.payload.stayListingId] = [];
        }
        const index = newReviews[message.payload.stayListingId].findIndex(
          (review) => review.id === message.payload.id
        );
        if (index >= 0) {
          newReviews[message.payload.stayListingId][index] = message.payload;
        } else {
          newReviews[message.payload.stayListingId].push(message.payload);
        }
        return newReviews;
      });
      break;
    case 'DELETED_REVIEW':
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews };
        Object.keys(newReviews).forEach((key) => {
          const numericKey = Number(key);
          newReviews[numericKey] = newReviews[numericKey].filter(
            (review) => review.id !== message.payload
          );
        });
        return newReviews;
      });
      break;
      case 'REQUESTED_HOST_ROLE':
      case 'APPROVED_HOST_ROLE':
      case 'REJECTED_HOST_ROLE':
      case 'DEMOTED_TO_TRAVELER':
        setAuthors((prevAuthors) => ({
          ...prevAuthors,
          [message.payload.id]: message.payload,
        }));
        if (message.payload.id === user?.id) {
          setUser(message.payload);
          sessionStorage.setItem('user', JSON.stringify(message.payload));
        }
        break;
      default:
        console.log('Unknown broadcast message type:', message.type);
    }
  };

  return (
    <WebSocketContext.Provider value={{
      notifications,
      fetchInitialNotifications,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      handleBroadcastMessage,
      authors,
      stayListings,
      reviews
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
