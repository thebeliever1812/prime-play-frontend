"use client"
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from '@/components'
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

            const response = await api.post("/video/upload-video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
        <div className='w-full max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md mt-20'>
            <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className='space-y-3'>
                <FormInput label='Title' name='title' register={register} placeholder='Enter video title' required type='text' error={errors.title?.message} />

                <div className='w-full flex flex-col gap-1 items-start '>
                    <label htmlFor="description" className="font-medium text-[16px] text-[#1E1E1E]">
                        Description*
                    </label>
                    <textarea id="description" placeholder='Enter video description' {...register("description")} className={`w-full border-[1px] rounded-[10px] px-3 pt-2 outline-none text-[14px] ${errors.description ? "border-red-600" : ""}`} aria-invalid={errors.description ? "true" : "false"} rows={2}>
                    </textarea>
                    {
                        errors.description && <p className="text-red-600 text-xs">{errors.description.message}</p>
                    }
                </div>

                <div className='w-full flex flex-col gap-3 sm:flex-row sm:gap-5 duration-200'>
                    <FormInput label='Thumbnail' name='thumbnail' register={register} required type='file' error={errors.thumbnail?.message as string} />

                    <FormInput label='Video File' name='videoFile' register={register} required type='file' error={errors.videoFile?.message as string} />
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