"use client"
import { Container, CustomLoader, VideoCard } from '@/components'
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    views: number;
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
                console.log('Fetched my videos:', response.data);
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

    if (isLoadingUser) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <CustomLoader />
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
            <CustomLoader />
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
        <Container className="max-w-6xl py-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center">
            {videos.map(video => (<VideoCard
                key={video._id}
                _id={video._id}
                title={video.title}
                description={video.description}
                uploadDate={video.createdAt}
                thumbnail={video.thumbnail}
                views={video.views}
            />)
            )}
        </Container>
    )
}

export default MyVideos