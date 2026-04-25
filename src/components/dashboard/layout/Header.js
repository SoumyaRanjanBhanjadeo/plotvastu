'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Header() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const eventSource = new EventSource(`${apiUrl}/inquiries/stream?token=${token}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.connected) return;

            setNotifications((prev) => [data, ...prev]);
            setHasUnread(true);

            // Play notification sound
            try {
                const audio = new Audio('/notification.wav');
                audio.play().catch(err => console.error('Audio playback failed:', err));
            } catch (error) {
                console.error('Error playing notification sound:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            setHasUnread(false);
        }
    };

    return (
        <header className="bg-linear-to-br from-blue-300 to-purple-300 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-end px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 relative">
                <button onClick={handleBellClick} className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
                    <Bell className="w-5 h-5" />
                    {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>

                {showDropdown && (
                    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white">
                            Notifications
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500">No new notifications</div>
                            ) : (
                                notifications.slice(0, 5).map((notif, idx) => (
                                    <div key={idx} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium">New Inquiry: {notif.name}</p>
                                        <p className="text-xs text-gray-500">{notif.email}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                            <Link href="/admin/leads" onClick={() => setShowDropdown(false)} className="text-sm text-blue-600 hover:underline">
                                View all notifications
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || 'admin@plotvastu.com'}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
