export interface Notification {
    _id: string;
    message: string;
    sender: string;
    createdAt: string;
    isRead: boolean;
    type: "NEW_VIDEO" | "COMMENT" | "LIKE" | "SUBSCRIBE";
    video?: string;
    comment?: string;
    channel?: string;
}
