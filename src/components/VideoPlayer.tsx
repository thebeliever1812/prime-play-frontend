"use client";
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader, VideoOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Container } from './index';

interface VideoPlayerProps {
    id: string;
}

interface Owner {
    _id: string;
    username: string;
    avatar: string;
    fullName: string;
}

interface VideoData {
    _id: string;
    title: string;
    description: string;
    videoFile: string;
    createdAt: string;
    views: number;
    duration: number;
    owner: Owner;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id }) => {
    const user = useAppSelector((state) => state.user.user);
    const isAuthenticated = !!user;
    const isLoadingUser = useAppSelector((state) => state.user.loading);
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/video/play-video/${id}`);
                console.log('Fetched video data:', response.data);
                setVideoData(response.data?.data || null);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching video data:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching video data:', error);
                }
            } finally {
                setLoadingVideo(false);
            }
        }
        if (!isLoadingUser && isAuthenticated) {
            fetchVideo();
        }
        if (!isAuthenticated && !isLoadingUser) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoadingUser, router]);

    if (isLoadingUser || loadingVideo) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8" />
        </Container>
        )
    }

    return (
        <Container className="max-w-5xl py-4 bg-gray-100 ">
            {videoData ? (
                <div className='flex justify-center items-center aspect-video w-full max-w-4xl mx-auto rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] flex-col gap-4 bg-white'>
                    <video
                        key={videoData._id}
                        src={videoData.videoFile}
                        controls
                        className='w-full h-full rounded-2xl'
                        autoPlay
                    />
                </div>
            ) : (
                <div className='flex justify-center items-center aspect-video w-full max-w-4xl mx-auto rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] flex-col gap-4 p-4 sm:p-6 bg-white'>
                    <VideoOff className='w-16 h-16 text-gray-600' />
                    <p className='text-lg text-gray-600'>Video not found.</p>
                </div>
            )}
        </Container>
    )
}

export default VideoPlayer