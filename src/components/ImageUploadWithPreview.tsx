"use client";
import React, { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import type {
    FieldValues,
    Path,
    UseFormRegister,
    UseFormWatch,
} from "react-hook-form";

type Props<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    watch: UseFormWatch<T>;
    required?: boolean;
    error?: string;
    buttonText: string;
    small?: boolean;
    accept?: "image/*" | "video/*";
};

export function ImageUploadWithPreview<T extends FieldValues>({
    label,
    name,
    register,
    watch,
    required,
    error,
    buttonText,
    small = true,
    accept,
}: Props<T>) {
    const inputId = useId();
    const fileList = watch(name);

    const [preview, setPreview] = useState<string>("");

    const file = useMemo(() => {
        return fileList && fileList.length > 0 ? fileList[0] : undefined;
    }, [fileList]);

    const isVideo = file?.type?.startsWith("video/");

    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        return () => reader.abort();
    }, [file]);

    const previewBoxClasses = small ? "w-24 h-24" : "w-48 h-48";

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">{label}{required && <span className="text-red-500">*</span>}</p>
            <div
                className={`relative ${previewBoxClasses} rounded-lg overflow-hidden bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center`}
            >
                {preview ? (
                    isVideo ? (
                        <video
                            src={preview}
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={preview}
                            alt={`${label} preview`}
                            fill
                            className="object-cover"
                        />
                    )
                ) : (
                    <span className="text-xs text-gray-500 text-center px-2">
                        No file selected
                    </span>
                )}
            </div>

            <input
                id={inputId}
                type="file"
                accept={accept}
                className="hidden"
                {...register(name, { required })}
            />

            <label
                htmlFor={inputId}
                className={`block border text-sm transition-colors text-gray-500 py-2 px-4 rounded-lg cursor-pointer text-center
                ${error ? "border-red-500" : "border-gray-300"}`}
            >
                {buttonText}
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
