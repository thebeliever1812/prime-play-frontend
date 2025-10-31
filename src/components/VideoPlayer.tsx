"use client";
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader, Maximize, Pause, Play, RotateCcw, VideoOff, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Container } from './index';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

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
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(true);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const router = useRouter()

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/video/play-video/${id}`);
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
        fetchVideo();
    }, [id]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    const handleFullscreen = () => {
        if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
    };

    const restartVideo = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    if (loadingVideo) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8" />
        </Container>
        )
    }

    return (
        <Container className="max-w-5xl py-4 space-y-4">
            {videoData ? (
                <>
                    <div className='flex justify-center items-center aspect-video w-full  mx-auto rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] flex-col gap-4 bg-white relative'>
                        <video
                            key={videoData._id}
                            src={videoData.videoFile}
                            className='w-full h-full rounded-2xl'
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            onLoadedMetadata={() => {
                                // Try autoplay programmatically too
                                videoRef.current?.play().catch(() => {
                                    console.log("Autoplay blocked, waiting for user interaction.");
                                });
                            }}
                        />
                        {/* Custom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex items-center justify-between text-white rounded-b-2xl">
                            <div className="flex items-center gap-3">
                                <button onClick={togglePlay}>
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </button>

                                <button onClick={toggleMute}>
                                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                </button>

                                <button onClick={restartVideo}>
                                    <RotateCcw size={22} />
                                </button>
                            </div>

                            <button onClick={handleFullscreen}>
                                <Maximize size={22} />
                            </button>
                        </div>
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
                                className='rounded-full cursor-pointer'
                                onClick={() => router.push(`/channel/${videoData.owner.username}`)}
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
                            {showFullDescription || videoData.description.length <= 100
                                ? videoData.description
                                : `${videoData.description.substring(0, 100)}...`}
                            {
                                videoData.description.length > 100 && (
                                    <span className='text-blue-600 ml-1'>
                                        {showFullDescription ? ' Show less' : ' Read more'}
                                    </span>
                                )
                            }
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