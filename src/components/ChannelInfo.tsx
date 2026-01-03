"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { SubscriptionForm } from './index';
import { api } from '@/utils/api';
import axios from 'axios';

interface ChannelInfoProps {
    username: string;
}

interface ChannelData {
    _id: string;
    avatar: string;
    channelsSubscribedToCount: number;
    coverImage: string;
    email: string;
    fullName: string;
    isSubscribed: boolean;
    subscribersCount: number;
    username: string;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({ username }) => {
    const [channelData, setChannelData] = useState<ChannelData | null>(null)
    const [isLoadingChannelData, setIsLoadingChannelData] = useState<boolean>(true)

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await api.get(`/user/channel/${username}`);
                setChannelData(response.data?.data)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching channel data in layout:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching channel data in layout:', error);
                }
            } finally {
                setIsLoadingChannelData(false)
            }
        }

        fetchChannelData()
    }, [username])

    return (
        <div className='w-full pt-3 pb-3'>
            <div className='w-full h-32 sm:h-56 relative'>
                {/* Cover image */}
                <div className='w-full h-full overflow-hidden relative rounded-2xl rounded-bl-none'>
                    <Image src={channelData?.coverImage || "/default_cover_image.jpeg"} alt='Cover Image' fill className='object-cover rounded-2xl rounded-bl-none' />
                </div>
                {/* Profile Image */}
                <div className='aspect-square rounded-full w-32 sm:w-52 absolute bottom-0 left-0 translate-y-1/2 '>
                    <div className='w-full h-1/2 overflow-hidden relative rounded-t-full border-2 sm:border-4 border-b-0 sm:border-b-0 border-white'>
                    </div>
                    <Image src={channelData?.avatar || "/default_avatar.png"} alt='Avatar' fill className='object-cover' />
                </div>
            </div>
            {
                isLoadingChannelData ? (
                    <div className='mt-16 sm:mt-[100px] px-4 sm:px-8 duration-200'>
                        <div className="flex flex-col gap-2">
                            <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-lg"></div>
                            <div className="animate-pulse bg-gray-300 w-36 h-3 rounded-lg"></div>
                            <div className="animate-pulse bg-gray-300 w-36 h-2 rounded-lg"></div>
                        </div>
                    </div>
                ) : (channelData ? (
                    <div className='mt-16 sm:mt-[100px] px-4 sm:px-8 duration-200'>
                        <h1 className='text-2xl sm:text-3xl font-bold'>{channelData?.fullName}</h1>
                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-5'>
                            <div>
                                <p className='text-sm text-gray-600'>{channelData?.username}</p>
                                <div className='text-sm text-gray-700'>
                                    <span>{channelData?.subscribersCount} subscribers</span> • <span>Subscribed to {channelData?.channelsSubscribedToCount} channels</span>
                                </div>
                            </div>
                            <SubscriptionForm channelId={channelData._id} isSubscribed={channelData.isSubscribed} />
                        </div>
                    </div>
                ) : (
                    <div className='mt-16 sm:mt-[100px] px-4 sm:px-8 duration-200'>
                        <h1 className='text-2xl sm:text-3xl font-semibold'>Channel not found</h1>
                    </div>
                ))
            }
        </div>
    )
}

export default ChannelInfo