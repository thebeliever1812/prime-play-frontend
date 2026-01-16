"use client";
import { useState, useCallback, useEffect } from "react";
import { Notification } from "@/types/notification";
import { api } from "@/utils/api";
import { useAppSelector } from "@/lib/hook";
import axios from "axios";
import { socket } from "@/utils/socket";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const user = useAppSelector((state) => state.user.user);

    // 🔹 1. Fetch notifications from backend
    useEffect(() => {
        if (!user?._id) return;

        const fetchNotifications = async () => {
            try {
                const { data } = await api.get("/notification");

                const result = data.data.map((notification: Notification) => ({
                    _id: notification._id,
                    message: notification.message,
                    createdAt: notification.createdAt,
                    isRead: notification.isRead,
                    type: notification.type,
                    video: notification.video,
                    channel: notification.channel,
                }));

                setNotifications(result);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log("Error fetching notifications:", error.response?.data.message || error.message);
                } else {
                    console.log("Unexpected error while fetching notifications:", error);
                }
            }
        };

        fetchNotifications();
    }, [user?._id]);


    // 🔹 2. Socket connection
    useEffect(() => {
        if (!user?._id) return;

        if (!socket.connected) socket.connect();

        socket.emit("join", user._id);

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

            setNotifications((prev) => [newNotification, ...prev]);
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

        await api.patch(`/notification/${id}/read`);
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

        await api.patch("/notification/read-all");
    }, []);

    const removeNotification = useCallback(async (id: string) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));

        await api.delete(`/notification/${id}`);
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
    };
};
