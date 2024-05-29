import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './authContext';
import { NotificationType } from '@/data/types';
import { fetchNotifications, markNotificationAsRead } from '@/api/notifications'; 

interface WebSocketContextType {
    notifications: NotificationType[];
    fetchInitialNotifications: (authorId: number) => void;
    markAsRead: (notificationId: number) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        if (!user) return;

        const token = sessionStorage.getItem('token');
        console.log('WebSocketProvider - user:', user);
        console.log('WebSocketProvider - token:', token);

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
        });

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            client.subscribe(`/topic/notifications/${user.id}`, (message: Message) => {
                const notification = JSON.parse(message.body) as NotificationType;
                setNotifications((prevNotifications) => [notification, ...prevNotifications]);
                console.log('Received notification:', notification);
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
        };

        client.onWebSocketClose = (event) => {
            console.error('WebSocket closed:', event);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
                console.log('WebSocket connection deactivated.');
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

    return (
        <WebSocketContext.Provider value={{ notifications, fetchInitialNotifications, markAsRead }}>
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
