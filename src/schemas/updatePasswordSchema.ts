import z from "zod";
import { passwordValidation } from "./userRegister.schema";

export const updatePasswordSchema = z
    .object({
        oldPassword: passwordValidation,
        newPassword: passwordValidation,
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    // newPassword !== oldPassword
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password must be different from old password",
        path: ["newPassword"],
    })
    // newPassword === confirmPassword
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
