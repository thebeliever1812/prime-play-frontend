"use client";
import { api } from '@/utils/api';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

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
    const [channelData, setChannelData] = useState<ChannelData | null>(null);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await api.get(`/user/channel/${username}`);
                setChannelData(response.data?.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching channel data:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching channel data:', error);
                }
            }
        };

        fetchChannelData();
    }, []);

    return (
        <div className='w-full bg-amber-400 pt-3'>
            <div className='w-full h-32 sm:h-56 relative'>
                {/* Cover image */}
                <div className='w-full h-full overflow-hidden relative rounded-2xl rounded-bl-none'>
                    <Image src={channelData?.coverImage || "/default_cover_image.jpeg"} alt='Cover Image' layout='fill' className='object-cover rounded-2xl rounded-bl-none' />
                </div>
                {/* Profile Image */}
                <div className='aspect-square rounded-full w-32 sm:w-52 absolute bottom-0 left-0 translate-y-1/2 '>
                    <div className='w-full h-1/2 overflow-hidden relative rounded-t-full border-4 border-b-0 border-white'>
                    </div>
                    <Image src={channelData?.avatar || "/default_avatar.png"} alt='Avatar' layout='fill' className='object-cover' />
                </div>
            </div>
            <div className='mt-16 mb-4 px-4 sm:px-8'>
                <h1 className='text-2xl sm:text-3xl font-bold'>{channelData?.fullName || 'Loading...'}</h1>
                <div className='text-sm text-gray-700'>
                    <span>{channelData?.subscribersCount || 0} subscribers</span> • <span>Subscribed to {channelData?.channelsSubscribedToCount || 0} channels</span>
                </div>
            </div>

        </div>
    )
}

export default ChannelInfo