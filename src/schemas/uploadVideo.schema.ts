import z from "zod";

export const thumbnailValidation = z
    .any()
    .refine((field) => field?.length > 0, "Thumbnail is required")
    .refine(
        (field) => field && field?.[0]?.type.startsWith("image/"),
        "Only image files are allowed"
    )
    .refine(
        (field) => field && field?.[0]?.size <= 10 * 1024 * 1024,
        "Thumbnail file size must be less than 10 MB"
    );

export const videoFileValidation = z
    .any()
    .refine((field) => field?.length > 0, "Video file is required")
    .refine(
        (field) => field && field?.[0]?.type.startsWith("video/"),
        "Only video files are allowed"
    )
    .refine(
        (field) => field && field?.[0]?.size <= 100 * 1024 * 1024,
        "Video file size must be less than 100 MB"
    );

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
    thumbnail: thumbnailValidation,
    videoFile: videoFileValidation,
});
