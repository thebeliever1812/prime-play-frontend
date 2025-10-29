"use client";
import { useAppSelector } from '@/lib/hook';
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader, VideoOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Container } from './index';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

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
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

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
        <Container className="max-w-5xl py-4 space-y-4">
            {videoData ? (
                <>
                    <div className='flex justify-center items-center aspect-video w-full  mx-auto rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] flex-col gap-4 bg-white'>
                        <video
                            key={videoData._id}
                            src={videoData.videoFile}
                            controls
                            className='w-full h-full rounded-2xl'
                            autoPlay
                        />
                    </div>
                    <div className='space-y-2'>
                        <h1 className='text-2xl font-extrabold text-[#1E293B]'>{videoData.title}</h1>
                        {/* Profile details */}
                        <div className='w-full max-w-sm flex items-center gap-2 '>
                            <Image
                                src={videoData.owner.avatar}
                                alt={videoData.owner.username}
                                width={45}
                                height={45}
                                className='rounded-full'
                            />
                            <div>
                                <p className='font-medium'>{videoData.owner.fullName}</p>
                                <p className='text-sm text-gray-500'>{videoData.owner.username}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`w-full text-sm text-[#475569] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-2 rounded-md space-y-1.5 ${videoData.description.length > 130 && "cursor-pointer"}`} onClick={() => setShowFullDescription(!showFullDescription)} >
                        {/* Views and upload date details */}
                        <div className='flex items-center gap-2 '>
                            <div className='flex items-center gap-1'>
                                <Image src="/views_icon.png" alt="Views" width={16} height={16} className='inline-block mr-1' />
                                <p>{videoData.views} views</p>
                            </div>
                            <span>|</span>
                            <p className=''>Uploaded: {formatDistanceToNow(new Date(videoData.createdAt), { addSuffix: true })}</p>
                        </div>
                        {/* Description */}
                        <p className='whitespace-pre-line' >
                            {showFullDescription || videoData.description.length <= 130
                                ? videoData.description
                                : `${videoData.description.substring(0, 130)}...`}
                        </p>
                    </div>
                </>
            ) : (
                <div className='flex justify-center items-center aspect-video w-full max-w-4xl mx-auto rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] flex-col gap-4 bg-white'>
                    <VideoOff className='w-16 h-16 text-gray-600' />
                    <p className='text-lg text-gray-600'>Video not found.</p>
                </div>
            )}
        </Container>
    )
}

export default VideoPlayer