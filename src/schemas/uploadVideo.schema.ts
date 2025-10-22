import z from "zod";

export const UploadVideoSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters"),
    description: z
        .string()
        .trim()
        .min(1, "Description cannot be empty")
        .max(5000, "Description cannot exceed 5000 characters"),
    thumbnail: z
        .any()
        .refine((field) => field?.length > 0, "Thumbnail is required")
        .refine(
            (field) => field && field?.[0]?.type.startsWith("image/"),
            "Only image files are allowed"
        ),
    videoFile: z
        .any()
        .refine((field) => field?.length > 0, "Video file is required")
        .refine(
            (field) => field && field?.[0]?.type.startsWith("video/"),
            "Only video files are allowed"
        ),
});
