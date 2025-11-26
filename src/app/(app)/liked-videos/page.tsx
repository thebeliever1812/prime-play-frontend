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

interface LikedVideo {
    _id: string;
    createdAt: string;
    likedVideo: Video;
}

const LikedVideos = () => {
    const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    const isLoadingUser = useAppSelector((state) => state.user.loading);
    const user = useAppSelector((state) => state.user.user);

    const isAuthenticated = !!user

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/video/liked-videos');
                setLikedVideos(response.data?.data || []);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error fetching liked videos:', error.response?.data?.message || error.message);
                } else {
                    console.error('Unexpected error while fetching liked videos:', error);
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

    if (likedVideos.length === 0) {
        return (
            <Container className="max-w-6xl py-4 flex justify-center items-center">
                <p className="text-gray-600">No videos found</p>
            </Container>
        )
    }

    return (
        <Container className="max-w-6xl py-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center">
            {likedVideos.map(video => (<VideoCard
                key={video._id}
                _id={video.likedVideo._id}
                title={video.likedVideo.title}
                description={video.likedVideo.description}
                uploadDate={video.likedVideo.createdAt}
                thumbnail={video.likedVideo.thumbnail}
                views={video.likedVideo.views}
            />)
            )}
        </Container>
    )
}

export default LikedVideos