"use client";
import { api } from '@/utils/api';
import axios from 'axios';
import { Loader2, Maximize, Pause, Play, RotateCcw, VideoOff, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Container, CustomLoader } from './index';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form"
import { CommentSchema } from '@/schemas/comment.schema';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/lib/hook';
import { toast } from 'react-toastify';

interface VideoPlayerProps {
    id: string;
}

interface Owner {
    _id: string;
    username: string;
    avatar: string;
    fullName: string;
    subscribersCount: number;
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

type CommentFormInput = z.infer<typeof CommentSchema>;

interface CommentOwner {
    _id: string;
    avatar: string;
    fullName: string;
}

interface Comment {
    _id: string
    content: string;
    createdAt: string;
    ownerDetails: CommentOwner;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id }) => {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(true);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [postingComment, setPostingComment] = useState(false);
    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState<boolean>(true);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const user = useAppSelector((state) => state.user.user)
    const isAuthenticated = !!user

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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CommentFormInput>({
        resolver: zodResolver(CommentSchema)
    })

    const onSubmit: SubmitHandler<CommentFormInput> = async (data) => {
        setPostingComment(true);
        if (!isAuthenticated) {
            toast.error("Please login to write a comment")
            setPostingComment(false)
            return
        }
        try {
            await api.post(`/comment`, {
                id,
                comment: data.comment
            });

            toast.success("Comment added successfully")
            reset()
            fetchComments();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error posting comment:', error.response?.data?.message || error.message);
            } else {
                console.log('Unexpected error while posting comment:', error);
            }
        } finally {
            setPostingComment(false);
        }
    }

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comment/video/${id}`);
            setComments(response.data?.data || [])
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error fetching comments:', error.response?.data?.message || error.message);
            } else {
                console.log('Unexpected error while fetching comments:', error);
            }
        } finally {
            setLoadingComments(false);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [id]);

    if (loadingVideo) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <CustomLoader />
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
                        <div className='w-full max-w-sm flex items-center gap-2'>
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
                                <p className='text-sm text-gray-600'>{videoData.owner.subscribersCount} subscribers</p>
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

            <div className='w-full px-2 py-3'>
                <h2 className='text-base sm:text-[18px] font-bold text-[#1E293B]'>Comments &#40;{comments.length}&#41;</h2>
                <div className='mt-2'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='p-3 w-full rounded-lg flex flex-col gap-2 items-end border-[1px] bg-[#F8FAFC] border-[#E2E8F0]'>
                            <textarea id="comment" placeholder='Write your comment here...' rows={2} className='placeholder-[#1E293B] w-full text-[14px] outline-none' {...register("comment")}></textarea>
                            {
                                errors.comment && <p role="alert">{errors.comment.message}</p>
                            }
                            <button type="submit" disabled={postingComment} className={``}>
                                {
                                    postingComment ? <Loader2 className='animate-spin' /> : <Image src={"/post_comment_button.png"} alt='Post Comment button' width={30} height={30} className='cursor-pointer hover:scale-105 transition-transform duration-200' />
                                }
                            </button>
                        </div>
                    </form>
                </div>

                <div className='w-full h-10 mt-3 space-y-3'>
                    {
                        comments.length > 0 ?
                            comments.map((comment) => (
                                <div key={comment._id} className='flex gap-3 items-start'>
                                    <div className='relative aspect-square w-[30px] sm:w-[40px] duration-150 rounded-full overflow-hidden mt-1'>
                                        <Image src={comment?.ownerDetails?.avatar || "/default_avatar.png"} alt='Avatar of the owner of comment' fill />
                                    </div>
                                    <div className='py-1 px-2 grow space-y-1'>
                                        <div className='flex w-full justify-between items-center'>
                                            <h3 className='text-[#1E293B] text-[14px] font-bold'>{comment.ownerDetails.fullName}</h3>
                                            <span className='text-[#475569] text-[12px]'>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        <p className='text-[#475569] text-[14px]'>{comment.content}</p>
                                    </div>
                                </div>
                            ))
                            :
                            <p className='text-[#475569] text-[14px]'>No comments found.</p>
                    }
                </div>
            </div>
        </Container>
    )
}

export default VideoPlayer