import * as z from "zod";

export const emailValidation = z.email();

export const passwordValidation = z
    .string()
    .trim()
    .min(6, "Must be at least 6 characters")
    .max(10, "Must not exceed 10 characters");

export const usernameValidation = z
    .string()
    .lowercase()
    .trim()
    .min(8, "Must be at least 8 characters")
    .max(12, "Must not exceed 12 characters")
    .regex(
        /^[a-z0-9_]+$/,
        "Username must be lowercase and contain only letters, numbers, or underscores (no spaces)"
    );

export const avatarValidation = z
    .any()
    .optional()
    .refine((field) => {
        if (!field || field.length === 0) {
            return true;
        }
        const file = field[0];
        return file.type.startsWith("image/");
    }, "Only image file is allowed");

export const coverImageValidation = z
    .any()
    .optional()
    .refine((field) => {
        if (!field || field.length === 0) {
            return true;
        }
        const file = field[0];
        return file.type.startsWith("image/");
    }, "Only image file is allowed");

export const UserRegisterSchema = z.object({
    username: usernameValidation,
    fullName: z
        .string()
        .trim()
        .min(2, "Must be at least 2 characters")
        .regex(
            /^[A-Za-z]+([ '-][A-Za-z]+)*$/,
            "Full name can contain only letters and spaces"
        ),
    email: emailValidation,
    password: passwordValidation,
    avatar: avatarValidation,
    coverImage: coverImageValidation,
});
