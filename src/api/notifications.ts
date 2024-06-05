import axiosInstance from './axiosConfig';
import { NotificationType } from '@/data/types';

export const fetchNotifications = async (authorId: number): Promise<NotificationType[]> => {
    try {
      const response = await axiosInstance.get<NotificationType[]>(`/notifications/author/${authorId}`);
      return response.data.map(notification => ({
        ...notification,
        isRead: notification.read
      }));
    } catch (error) {
      console.error("fetchNotifications error:", error);
      throw new Error("Failed to fetch notifications.");
    }
  };

export const deleteNotificationsForAuthor = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/notifications/author/${authorId}`);
  } catch (error) {
    console.error("deleteNotificationsForAuthor error:", error);
    throw new Error("Failed to delete notifications.");
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

export const markAllNotificationsAsRead = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/notifications/author/${authorId}/read-all`);
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    throw new Error("Failed to mark all notifications as read.");
  }
};
