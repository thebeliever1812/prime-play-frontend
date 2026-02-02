"use client"
import { Container, CustomLoader, VideoCard, VideoCardSkeleton } from '@/components'
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import { LogIn, Video, VideoOff } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    views: number;
    owner: string;
}

const MyVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    const isLoadingUser = useAppSelector((state) => state.user.loading);
    const user = useAppSelector((state) => state.user.user);

    const isAuthenticated = !!user

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/video/my-videos');
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
        } else if (!isLoadingUser && !isAuthenticated) {
            setLoadingVideos(false);
        }
    }, [isLoadingUser, isAuthenticated]);

    if (loadingVideos) {
        return (<Container className="max-w-6xl py-6">
            <div className="flex items-center gap-3 mb-6">
                <Video className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-semibold text-[#1E293B]">My Videos</h1>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center">
                {Array.from({ length: 9 }).map((_, index) => (
                    <VideoCardSkeleton key={index} />
                ))}
            </div>
        </Container>
        )
    }

    if (!isAuthenticated) {
        return (<Container className="max-w-6xl py-6">
            <div className="flex items-center gap-3 mb-6">
                <Video className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-semibold text-[#1E293B]">My Videos</h1>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <LogIn className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Log in to view your videos
                </h2>
                <p className="text-gray-500 mb-6 max-w-md">
                    Manage and revisit all the videos you&apos;ve uploaded.
                </p>
                <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
        </Container>
        )
    }

    if (videos.length === 0) {
        return (
            <Container className="max-w-6xl py-6">
                <div className="flex items-center gap-3 mb-6">
                    <Video className="h-7 w-7 text-indigo-600" />
                    <h1 className="text-2xl font-semibold text-[#1E293B]">My Videos</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <VideoOff className="h-10 w-10 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        No videos yet
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Videos you upload will appear here so you can manage them anytime.
                    </p>
                </div>
            </Container>
        )
    }

    return (
        <Container className="max-w-6xl py-4">
            <div className="flex items-center gap-3 mb-6">
                <Video className="h-7 w-7 text-indigo-600" />
                <h1 className="text-2xl font-semibold text-[#1E293B]">My Videos</h1>
            </div>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center'>
                {videos.map(video => (<VideoCard
                    key={video._id}
                    _id={video._id}
                    title={video.title}
                    description={video.description}
                    uploadDate={video.createdAt}
                    thumbnail={video.thumbnail}
                    views={video.views}
                    ownerId={video.owner}
                    setVideos={setVideos}
                />)
                )}
            </div>
        </Container>
    )
}

export default MyVideos