// Define StaticImageData to resolve TypeScript errors
type StaticImageData = any;

"use client";

import { Popover, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar";
import { BellIcon } from "@heroicons/react/24/outline";
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/authContext';
import { formatDistanceToNow } from 'date-fns';
import fetchAuthorById from '@/api/fetchAuthorById';
import { AuthorType, NotificationType } from "@/data/types";

interface Props {
  className?: string;
}

const NotifyDropdown: FC<Props> = ({ className = "" }) => {
  const { notifications, fetchInitialNotifications, markAsRead } = useWebSocket();
  const { user } = useAuth();
  const [authors, setAuthors] = useState<{ [key: number]: { name: string; avatar: string | StaticImageData } }>({});

  useEffect(() => {
    if (user) {
      fetchInitialNotifications(user.id);
    }
  }, [user, fetchInitialNotifications]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const uniqueAuthorIds = [...new Set(notifications.map((n: NotificationType) => n.authorId))];
      const authorData = await Promise.all(uniqueAuthorIds.map(async id => {
        const author: AuthorType = await fetchAuthorById(id);
        return { id, name: `${author.firstName} ${author.lastName}`, avatar: author.avatar };
      }));
      const authorMap = Object.fromEntries(authorData.map(a => [a.id, { name: a.name, avatar: a.avatar }]));
      setAuthors(authorMap);
    };

    fetchAuthors();
  }, [notifications]);

  return (
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
                <div className="relative grid gap-8 bg-white dark:bg-neutral-800 p-7">
                  <h3 className="text-xl font-semibold">Notifications</h3>
                  {notifications.map((notification: NotificationType, index: number) => {
                    const author = authors[notification.authorId] || { name: 'Unknown', avatar: '' };
                    return (
                      <a
                        key={index}
                        href="#"
                        className="flex p-2 pr-8 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 relative"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Avatar
                          imgUrl={author.avatar}
                          sizeClass="w-8 h-8 sm:w-12 sm:h-12"
                        />
                        <div className="ml-3 sm:ml-4 space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {author.name}
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
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NotifyDropdown;
