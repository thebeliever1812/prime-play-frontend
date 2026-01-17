"use client";
import { useState, useCallback, useEffect } from "react";
import { Notification } from "@/types/notification";
import { api } from "@/utils/api";
import { useAppSelector } from "@/lib/hook";
import axios from "axios";
import { socket } from "@/utils/socket";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasMoreNotifications, setHasMoreNotifications] = useState(false);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const user = useAppSelector((state) => state.user.user);

    // 🔹 1. Fetch notifications from backend
    useEffect(() => {
        if (!user?._id) return;

        const fetchNotifications = async () => {
            try {
                const { data } = await api.get("/notification", {
                    params: {
                        limit: 3,
                    },
                });

                const result = data.data.notifications.map(
                    (notification: Notification) => ({
                        _id: notification._id,
                        message: notification.message,
                        createdAt: notification.createdAt,
                        isRead: notification.isRead,
                        type: notification.type,
                        video: notification.video,
                        channel: notification.channel,
                        sender: notification.sender,
                        senderName: notification.senderName,
                    })
                );

                setNotifications(result);
                setHasMoreNotifications(data.data.hasMoreNotifications);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(
                        "Error fetching notifications:",
                        error.response?.data.message || error.message
                    );
                } else {
                    console.log(
                        "Unexpected error while fetching notifications:",
                        error
                    );
                }
            }
        };

        fetchNotifications();
    }, [user?._id]);

    const fetchAllNotifications = async () => {
        try {
            const { data } = await api.get("/notification"); // no limit

            const result = data.data.notifications.map(
                (notification: Notification) => ({
                    _id: notification._id,
                    message: notification.message,
                    createdAt: notification.createdAt,
                    isRead: notification.isRead,
                    type: notification.type,
                    video: notification.video,
                    channel: notification.channel,
                    sender: notification.sender,
                    senderName: notification.senderName,
                })
            );

            setNotifications(result);
            setHasMoreNotifications(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error fetching all notifications:",
                    error.response?.data.message || error.message
                );
            } else {
                console.log(
                    "Unexpected error while fetching all notifications:",
                    error
                );
            }
        }
    };

    // 🔹 2. Socket connection
    useEffect(() => {
        if (!user?._id) return;

        if (!socket.connected) socket.connect();

        socket.emit("join", user._id);

        const NOTIFICATION_LIMIT = 3;

        socket.on("notification:new", (data) => {
            const newNotification: Notification = {
                _id: data.notificationId ?? crypto.randomUUID(),
                sender: data.sender,
                message: data.message,
                createdAt: data.createdAt,
                isRead: false,
                type: data.type,
                video: data.videoId,
                channel: data.channelId,
            };

            setNotifications((prev) => {
                const updated = [newNotification, ...prev];

                return updated.slice(0, NOTIFICATION_LIMIT);
            });
        });

        return () => {
            socket.off("notification:new");
            socket.disconnect();
        };
    }, [user?._id]);

    // 🔹 3. Actions
    const markAsRead = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );

        try {
            await api.patch(`/notification/${id}/read`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error marking notification as read:",
                    error.response?.data.message || error.message
                );
            } else {
                console.log(
                    "Unexpected error while marking notification as read:",
                    error
                );
            }
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

        try {
            await api.patch("/notification/read-all");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error marking all notifications as read:",
                    error.response?.data.message || error.message
                );
            } else {
                console.log(
                    "Unexpected error while marking all notifications as read:",
                    error
                );
            }
        }
    }, []);

    const removeNotification = useCallback(async (id: string) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));

        try {
            await api.delete(`/notification/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error removing notification:",
                    error.response?.data.message || error.message
                );
            } else {
                console.log(
                    "Unexpected error while removing notification:",
                    error
                );
            }
        }
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        hasMoreNotifications,
        fetchAllNotifications,
    };
};
