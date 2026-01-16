"use client"
import { Check, X, Info, Youtube, MessageSquareMore, ThumbsUp, UserCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

const getTimeAgo = (date: string): string => {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });
};

const getNotificationIcon = (type?: Notification['type']) => {
    switch (type) {
        case 'NEW_VIDEO':
            return <Youtube className="w-4 h-4 text-green-500" />;
        case 'COMMENT':
            return <MessageSquareMore className="w-4 h-4 text-yellow-500" />;
        case 'LIKE':
            return <ThumbsUp className="w-4 h-4 text-pink-500" />;
        case 'SUBSCRIBE':
            return <UserCheck className="w-4 h-4 text-purple-500" />;
        default:
            return <Info className="w-4 h-4 text-blue-500" />;
    }
};

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onRemove: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onRemove }: NotificationItemProps) => {
    return (
        <div
            className={cn(
                'relative flex gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 group hover:shadow-lg',
                !notification.isRead && 'bg-primary/5 bg-gray-100'
            )}
        >
            {/* Unread indicator dot */}
            {!notification.isRead && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6 cursor-pointer">
                {notification.type === 'NEW_VIDEO' && (
                    <p className={cn(
                        'text-sm font-medium truncate',
                        !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                        New video from {notification.sender}
                    </p>
                )}
                <p className={cn(
                    'text-sm',
                    !notification.isRead ? 'text-foreground/80' : 'text-muted-foreground'
                )}>
                    {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {getTimeAgo(notification.createdAt)}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.isRead && (
                    <button
                        className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification._id);
                        }}
                        title="Mark as read"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notification._id);
                    }}
                    title="Remove"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default NotificationItem