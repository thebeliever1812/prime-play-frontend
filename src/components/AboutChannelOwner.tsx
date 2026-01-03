"use client"
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface AboutChannelOwnerProps {
    username: string;
}

interface ChannelOwnerDetails {
    _id: string;
    channelsSubscribedToCount: number;
    email: string;
    fullName: string;
    subscribersCount: number;
    username: string;
    videosCount: number;
}

const AboutChannelOwner = ({ username }: AboutChannelOwnerProps) => {
    const [isLoadingChannelOwnerDetails, setIsLoadingChannelOwnerDetails] = useState<boolean>(true)
    const [channelOwnerDetails, setChannelOwnerDetails] = useState<ChannelOwnerDetails | null>(null)

    useEffect(() => {
        const fetchChannelOwnerDetails = async () => {
            try {
                const response = await api.get(`/user/channel/${username}`)
                setChannelOwnerDetails(response.data?.data)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching channel owner details:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching channel owner details:', error);
                }
            } finally {
                setIsLoadingChannelOwnerDetails(false)
            }
        }

        fetchChannelOwnerDetails()
    }, [username])

    if (isLoadingChannelOwnerDetails) {
        return (
            <div className='w-full flex justify-center items-center h-20'>
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        )
    }

    return (
        <div className='w-full p-4 rounded-md'>
            <table className='table-cell w-full text-left break-all whitespace-normal text-sm sm:text-base'>
                <tbody>
                    <tr>
                        <td className='font-semibold pr-4'>Full Name:</td>
                        <td>{channelOwnerDetails?.fullName}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold pr-4'>Email:</td>
                        <td>{channelOwnerDetails?.email}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold pr-4'>Username:</td>
                        <td>{channelOwnerDetails?.username}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold pr-4'>Subscribers Count:</td>
                        <td>{channelOwnerDetails?.subscribersCount}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold pr-4'>Channels Subscribed To:</td>
                        <td>{channelOwnerDetails?.channelsSubscribedToCount}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold pr-4'>Videos Uploaded:</td>
                        <td>{channelOwnerDetails?.videosCount}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default AboutChannelOwner