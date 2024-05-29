import axiosInstance from './axiosConfig';
import { NotificationType } from '@/data/types';

export const fetchNotifications = async (authorId: number): Promise<NotificationType[]> => {
  try {
    const response = await axiosInstance.get<NotificationType[]>(`/notifications/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("fetchNotifications error:", error);
    throw new Error("Failed to fetch notifications.");
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    throw new Error("Failed to mark notification as read.");
  }
};
