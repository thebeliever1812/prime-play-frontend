"use client"
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NotificationItem } from "./index"

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
                <Bell className="h-5 w-5" />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b-[1px] border-[#E2E8F0] bg-muted/30 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                className="h-7 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                onClick={markAllAsRead}
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="p-2 space-y-1">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                        onRemove={removeNotification}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Bell className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                                <p className="text-xs mt-1">We'll notify you when something arrives</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t-[1px] border-[#E2E8F0] px-4 py-2 bg-muted/30 rounded-b-lg">
                            <button className="w-full text-xs text-muted-foreground hover:text-foreground py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};