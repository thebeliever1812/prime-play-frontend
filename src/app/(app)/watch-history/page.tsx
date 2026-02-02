"use client"
import { Container, WatchHistoryCardSkeleton, WatchHistoryVideoCard } from '@/components'
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import { Clock, History, LogIn } from 'lucide-react';
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
    owner: Owner;
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

    if (loadingVideos) {
        return (<Container className="max-w-5xl py-6">
            <div className="flex items-center gap-3 mb-6">
                <History className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-bold text-foreground">Watch History</h1>
            </div>
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <WatchHistoryCardSkeleton key={index} />
                ))}
            </div>
        </Container>
        )
    }

    if (!isAuthenticated) {
        return (<Container className="max-w-5xl py-6">
            <div className="flex items-center gap-3 mb-6">
                <History className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-bold text-foreground">Watch History</h1>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <LogIn className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Log in to view your watch history
                </h2>
                <p className="text-gray-500 mb-6 max-w-md">
                    Keep track of what you've watched and pick up where you left off
                </p>
                <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
        </Container>
        )
    }

    if (videos.length === 0) {
        return (
            <Container className="max-w-5xl py-6">
                <div className="flex items-center gap-3 mb-6">
                    <History className="h-7 w-7 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-foreground">Watch History</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <Clock className="h-10 w-10 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        No watch history yet
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Videos you watch will appear here so you can easily find them again
                    </p>
                </div>
            </Container>
        )
    }

    return (
        <Container className="max-w-5xl py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <History className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-bold text-black">Watch History</h1>
                <span className="text-sm text-gray-500 ml-2">
                    ({videos.length} videos)
                </span>
            </div>

            {/* Video list */}
            <div className="space-y-2">
                {videos.map((video) => (
                    <WatchHistoryVideoCard
                        key={video._id}
                        _id={video._id}
                        title={video.title}
                        thumbnail={video.thumbnail}
                        views={video.views}
                        fullName={video.owner.fullName}
                        duration={video.duration}
                        setVideos={setVideos}
                        avatar={video.owner.avatar}
                        username={video.owner.username}
                    />
                ))}
            </div>
        </Container>
    )
}

export default WatchHistory