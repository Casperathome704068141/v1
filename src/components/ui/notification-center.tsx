'use client';
import { useNotifications } from '@/context/notifications-context';

export default function NotificationCenter() {
  const { notifications } = useNotifications();
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      {notifications.map(n => (
        <div key={n.id} className="p-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm">{n.message}</p>
          {n.timestamp && (
            <span className="text-xs text-gray-400">
              {n.timestamp.toDate?.().toLocaleString?.()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
