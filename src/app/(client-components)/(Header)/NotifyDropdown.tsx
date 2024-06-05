"use client";

import { Popover, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Avatar from "@/shared/Avatar";
import { BellIcon } from "@heroicons/react/24/outline";
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/authContext';
import { formatDistanceToNow } from 'date-fns';
import fetchAuthorById from '@/api/fetchAuthorById';
import { AuthorType, NotificationType } from "@/data/types";
import ButtonForth from "@/shared/ButtonForth";
import Modal from '@/components/Modal';

interface Props {
  className?: string;
  notifications: NotificationType[];
}

type StaticImageData = any;

const NotifyDropdown: FC<Props> = ({ className = "", notifications }) => {
  const router = useRouter();
  const { fetchInitialNotifications, markAsRead, markAllAsRead, clearNotifications } = useWebSocket();
  const { user } = useAuth();
  const [senders, setSenders] = useState<{ [key: number]: { name: string; avatar: string | StaticImageData } }>({});
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });

  useEffect(() => {
    if (user) {
      fetchInitialNotifications(user.id);
    }
  }, [user, fetchInitialNotifications]);

  useEffect(() => {
    const fetchSenders = async () => {
      const uniqueSenderIds = [...new Set(notifications.map((n: NotificationType) => n.senderId))];
      const senderData = await Promise.all(uniqueSenderIds.map(async id => {
        const sender: AuthorType = await fetchAuthorById(id);
        return { id, name: `${sender.firstName}`, avatar: sender.avatar };
      }));
      const senderMap = Object.fromEntries(senderData.map(s => [s.id, { name: s.name, avatar: s.avatar }]));
      setSenders(senderMap);
    };

    fetchSenders();
  }, [notifications]);

  const handleClearAll = async () => {
    if (user) {
      setModal({
        isOpen: true,
        type: "confirm",
        message: "Are you sure you want to clear all notifications?",
        onConfirm: async () => {
          try {
            await clearNotifications(user.id);
            setModal({ ...modal, isOpen: false });
          } catch (error) {
            console.error("Failed to clear notifications:", error);
            setModal({
              isOpen: true,
              type: "message",
              message: "Failed to clear notifications. Please try again later.",
              onConfirm: () => setModal({ ...modal, isOpen: false }),
              onCancel: () => setModal({ ...modal, isOpen: false }),
            });
          }
        },
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  const handleReadAll = async () => {
    if (user) {
      try {
        await markAllAsRead(user.id);
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    }
  };

  const handleNotificationClick = async (notification: NotificationType) => {
    await markAsRead(notification.id);

    switch (notification.type) {
      case 'REQUEST_TO_HOST':
        router.push(`/author/${notification.senderId}`);
        break;
      case 'STAY_REVIEW':
        if (notification.stayId) {
          router.push(`/listing-stay-detail/${notification.stayId}`);
        } else {
          router.push(`/author/${notification.senderId}`);
        }
        break;
      case 'RESERVATION':
      case 'CANCEL_RESERVATION':
        if (notification.stayId) {
          router.push(`/listing-stay-detail/${notification.stayId}`);
        } else {
          router.push(`/author/${notification.senderId}`);
        }
        break;
      case 'REJECT_HOST':
      case 'HOST_REJECTION':
      case 'DEMOTE_TRAVELER':
        // No redirection needed
        break;
      default:
        console.warn(`Unhandled notification type: ${notification.type}`);
    }
  };

  const handleToggleShowAllNotifications = () => {
    setShowAllNotifications(!showAllNotifications);
  };

  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 4);

  return (
    <>
      <Popover className={`relative flex ${className}`}>
        {({ open }) => (
          <>
            <Popover.Button
              className={` ${
                open ? "" : "text-opacity-90"
              } group self-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center justify-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
            >
              {notifications.some((n: NotificationType) => !n.isRead) && (
                <span className="w-2 h-2 absolute top-2 right-2 rounded-full" style={{ backgroundColor: 'rgb(202, 138, 4)' }}></span>
              )}
              <BellIcon className="h-6 w-6" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-xs sm:max-w-sm px-4 top-full -right-28 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white dark:bg-neutral-800 p-7 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Notifications</h3>
                      {notifications.length > 0 && (
                        <ButtonForth onClick={handleReadAll} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                          Read All
                        </ButtonForth>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="text-neutral-500 dark:text-neutral-400 py-8 text-center">
                        No notifications yet
                      </div>
                    ) : (
                      <>
                        {displayedNotifications.map((notification: NotificationType, index: number) => {
                          const sender = senders[notification.senderId] || { name: 'Unknown', avatar: '' };
                          return (
                            <a
                              key={index}
                              href="#"
                              className="flex p-2 pr-8 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 relative"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <Avatar
                                imgUrl={sender.avatar}
                                sizeClass="w-8 h-8 sm:w-12 sm:h-12"
                              />
                              <div className="ml-3 sm:ml-4 space-y-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                  {sender.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-400">
                                  {formatDistanceToNow(new Date(notification.timestamp))} ago
                                </p>
                              </div>
                              {!notification.isRead && (
                                <span className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(202, 138, 4)' }}></span>
                              )}
                            </a>
                          );
                        })}
                        <div className="pt-4 text-center flex justify-center gap-2">
                          {notifications.length > 4 && (
                            <ButtonForth onClick={handleToggleShowAllNotifications} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                              {showAllNotifications ? 'Hide Notifications' : 'View More Notifications'}
                            </ButtonForth>
                          )}
                          <ButtonForth onClick={handleClearAll} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                            Clear All
                          </ButtonForth>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <Modal
        type={modal.type}
        message={modal.message}
        isOpen={modal.isOpen}
        onClose={modal.onCancel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  );
};

export default NotifyDropdown;
