"use client"
import { Container, WatchHistoryVideoCard } from '@/components'
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Owner {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
}

interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    description: string;
    videoFile: string;
    duration: number;
    views: number;
    owner: Owner
}

const WatchHistory = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    const isLoadingUser = useAppSelector((state) => state.user.loading);
    const user = useAppSelector((state) => state.user.user);
    const isAuthenticated = !!user

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/user/history');
                setVideos(response.data?.data || []);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching my videos:', error.response?.data?.message || error.message);
                } else {
                    console.error('Unexpected error while fetching my videos:', error);
                }
            } finally {
                setLoadingVideos(false);
            }
        }

        if (!isLoadingUser && isAuthenticated) {
            fetchVideos();
        }

        if (!isLoadingUser && !isAuthenticated) {
            setLoadingVideos(false);
        }
    }, [isLoadingUser, isAuthenticated]);

    if (isLoadingUser) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8" />
        </Container>
        )
    }

    if (!isAuthenticated) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <p className="text-gray-600">Please login to view your videos. <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </Container>
        )
    }

    if (loadingVideos) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8" />
        </Container>
        )
    }

    if (videos.length === 0) {
        return (
            <Container className="max-w-6xl py-4 flex justify-center items-center">
                <p className="text-gray-600">No videos found</p>
            </Container>
        )
    }

    return (
        <Container className="max-w-5xl py-4">
            {videos.map((video) => (
                <div key={video._id} className="mb-4">
                    <WatchHistoryVideoCard
                        _id={video._id}
                        title={video.title}
                        thumbnail={video.thumbnail}
                        views={video.views}
                        fullName={video.owner.fullName}
                    />
                </div>
            ))}
        </Container>
    )
}

export default WatchHistory