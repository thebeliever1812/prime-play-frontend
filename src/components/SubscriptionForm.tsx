"use client"
import { api } from '@/utils/api';
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useAppSelector } from '@/lib/hook';
import Link from 'next/link';

interface SubscriptionFormProps {
    isSubscribed: boolean;
    channelId?: string;
}

interface FormInputs {
    subscribedStatus: boolean
}

const SubscriptionForm = ({ isSubscribed, channelId }: SubscriptionFormProps) => {
    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const user = useAppSelector(state => state.user.user)
    const isAuthenticated = !!user

    const {
        register,
        watch,
        setValue,
        handleSubmit,
    } = useForm<FormInputs>({
        defaultValues: { subscribedStatus: isSubscribed },
    })

    const currentState = watch("subscribedStatus")

    const onSubmit = async (data: FormInputs) => {
        const previousState = data.subscribedStatus;

        // Optimistically update UI
        if (isAuthenticated) {
            setValue("subscribedStatus", !previousState);
            try {
                const response = await api.post('/subscribe', { subscribe: !previousState, channelId });
                console.log('Subscription response:', response.data);

                if (!response.data.success) {
                    throw new Error("Failed to update subscription");
                }
            } catch (error) {
                setValue("subscribedStatus", previousState)
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
        <div className='relative w-full'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("subscribedStatus")}
                />
                <button
                    type="submit"
                    className={`w-full max-w-28 flex justify-center items-center  px-3 py-2 rounded-md border-[1px] border-[#4F46E5] hover:scale-105 transition-all duration-200 cursor-pointer ${currentState ? "text-[#4F46E5] bg-white" : "text-white bg-[#4F46E5]"} `}
                >
                    {currentState ? "Subscribed" : "Subscribe"}
                </button>
            </form>
            {
                showLoginPopup && (
                    <>
                        <div className='fixed w-full h-full top-0 left-0 bg-black/40 z-[50] cursor-pointer' onClick={() => setShowLoginPopup(false)}>
                        </div>
                        <div className='absolute top-12 w-full max-w-lg p-4 rounded-xl bg-white z-[55]'>
                            <h2 className='text-lg font-semibold mb-2'>Login Required</h2>
                            <p className='mb-4'>You need to be logged in to subscribe to channels.</p>
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

export default SubscriptionForm