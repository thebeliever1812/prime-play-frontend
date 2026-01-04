"use client"
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput, ImageUploadWithPreview } from '@/components'
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { UploadVideoSchema } from '@/schemas/uploadVideo.schema';

type Inputs = z.infer<typeof UploadVideoSchema>

const UploadVideoForm = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(UploadVideoSchema)
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsSubmitting(true)
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);

            // Append the actual file objects (React Hook Form gives you a FileList)
            if (data.thumbnail && data.thumbnail[0]) {
                formData.append("thumbnail", data.thumbnail[0]);
            }
            if (data.videoFile && data.videoFile[0]) {
                formData.append("videoFile", data.videoFile[0]);
            }

            const response = await api.post("/video/upload-video", formData);
            toast.success(response.data?.message)
            router.replace("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } else {
                toast.error("Unexpected error");
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='w-full max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md mt-20'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
                <FormInput label='Title' name='title' register={register} placeholder='Enter video title' required type='text' error={errors.title?.message} />

                <div className='w-full'>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                        Description<span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                        id="description"
                        placeholder='Enter video description'
                        {...register("description")}
                        className={`w-full px-4 py-3 text-sm rounded-lg border-2 transition-all duration-200 resize-none outline-none ${errors.description
                            ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                            : "border-gray-200 bg-white hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            }`}
                        aria-invalid={errors.description ? "true" : "false"}
                        rows={4}
                    />
                    {errors.description && <p className="mt-1 text-xs font-medium text-red-600">{errors.description.message}</p>}
                </div>

                <div className='w-full flex flex-col gap-3 sm:flex-row sm:justify-around sm:gap-5 duration-200'>
                    <ImageUploadWithPreview<Inputs>
                        label='Thumbnail Image'
                        name='thumbnail'
                        register={register}
                        watch={watch}
                        required={true}
                        buttonText='Choose Thumbnail'
                        error={errors.thumbnail?.message as string}
                        accept="image/*"
                        small={false}
                    />

                    <ImageUploadWithPreview<Inputs>
                        label='Video File'
                        name='videoFile'
                        register={register}
                        watch={watch}
                        required={true}
                        buttonText='Choose Video'
                        error={errors.videoFile?.message as string}
                        accept="video/*"
                        small={false}
                    />
                </div>

                <button type="submit" className={`flex justify-center items-center gap-2 text-white w-full rounded-[10px] h-[35px] mt-3  ${isSubmitting ? "bg-[#948fef] cursor-not-allowed" : "bg-[#4F46E5] cursor-pointer"}`} disabled={isSubmitting} >
                    {isSubmitting ? `Please wait` : "Upload"}
                    {isSubmitting && <Loader2 className='animate-spin' />}
                </button>
            </form>
        </div>
    )
}

export default UploadVideoForm