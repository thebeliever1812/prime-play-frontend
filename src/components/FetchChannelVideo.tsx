"use client"
import React, { useEffect, useState } from 'react'
import { VideoCard } from '@/components'
import { api } from '@/utils/api'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    views: number;
}

interface FetchChannelVideoProps {
    username: string;
}

const FetchChannelVideo: React.FC<FetchChannelVideoProps> = ({ username }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [videos, setVideos] = useState<Video[]>([])

    useEffect(() => {
        const fetchChannelVideo = async () => {
            try {
                const response = await api.get(`/video/channel-videos/${username}`)
                setVideos(response.data?.data)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching channel videos:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching channel videos:', error);
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchChannelVideo()
    }, [])

    if (isLoading) {
        return (
            <div className='w-full flex justify-center items-center h-20'>
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        )
    }

    if (videos.length === 0) {
        return (
            <div className='w-full flex justify-center items-center h-20'>
                <p className="text-gray-600">No videos found</p>
            </div>
        )
    }

    return (
        <div className='w-full grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mt-3'>
            {videos.map(video => (
                <VideoCard key={video._id} title={video.title} thumbnail={video.thumbnail} description={video.description} views={video.views} uploadDate={video.createdAt} _id={video._id} />
            ))}
        </div>
    )
}

export default FetchChannelVideo