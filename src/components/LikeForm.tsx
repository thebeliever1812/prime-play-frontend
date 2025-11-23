"use client"
import { useAppSelector } from '@/lib/hook'
import { api } from '@/utils/api'
import axios from 'axios'
import { ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface LikeFormProps {
    isLiked: boolean;
    channelId?: string;
    videoId: string;
}

interface FormInputs {
    likeStatus: boolean
}

const LikeForm = ({ isLiked, channelId, videoId }: LikeFormProps) => {
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false)
    const user = useAppSelector(state => state.user.user)
    const isAuthenticated = !!user

    const {
        register,
        watch,
        setValue,
        handleSubmit,
    } = useForm<FormInputs>({
        defaultValues: { likeStatus: isLiked },
    })

    const currentState = watch("likeStatus")

    const onSubmit = async (data: FormInputs) => {
        const previousState = data.likeStatus;

        // Optimistically update UI
        if (isAuthenticated) {
            setValue("likeStatus", !previousState);
            try {
                const response = await api.post(`/like/video/${videoId}`, {
                    isLiked: !previousState
                })
            } catch (error) {
                setValue("likeStatus", previousState)
                if (axios.isAxiosError(error)) {
                    console.error('Error subscribing channel:', error.response?.data?.message || error.message);
                } else {
                    console.error('Unexpected error while subscribing channel:', error);
                }
            }
        } else {
            setShowLoginPopup(true)
        }
    }

    return (
        <div className='relative'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("likeStatus")}
                />
                <button
                    type="submit"
                    className='flex items-center'
                >
                    {currentState ? <ThumbsUp className='fill-[#4F46E5] text-[#4F46E5] active:scale-110 duration-150' /> : <ThumbsUp />}
                </button>
            </form>
            {
                showLoginPopup && (
                    <>
                        <div className='fixed w-full h-full top-0 left-0 bg-black/40 z-[50] cursor-pointer' onClick={() => setShowLoginPopup(false)}>
                        </div>
                        <div className='absolute top-12 w-full max-w-lg p-4 rounded-xl bg-white z-[55]'>
                            <h2 className='text-lg font-semibold mb-2'>Login Required</h2>
                            <p className='mb-4'>You need to be logged in to like the video.</p>
                            <div className='mb-4'>
                                <Link href='/login' className='text-blue-600 underline' onClick={() => setShowLoginPopup(false)}>Click here to login</Link>
                            </div>
                            <div className='flex justify-end gap-4'>
                                <button
                                    className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition'
                                    onClick={() => setShowLoginPopup(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default LikeForm