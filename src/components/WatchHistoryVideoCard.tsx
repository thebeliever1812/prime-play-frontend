"use client"
import { api } from '@/utils/api';
import axios from 'axios';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

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

interface WatchHistoryVideoCardProps {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    fullName: string;
    setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
}

const WatchHistoryVideoCard: React.FC<WatchHistoryVideoCardProps> = ({ _id, title, thumbnail, views, fullName, setVideos }) => {
    const router = useRouter()
    const [showOptions, setShowOptions] = useState<boolean>(false);

    useEffect(() => {
        let body = document.body
        if (showOptions) {
            body.style.position = "fixed";
            body.style.top = "0";
            body.style.left = "0";
            body.style.width = "100%";
            body.style.overflowY = "scroll"; // keep scrollbar visible
        } else {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.width = "";
            body.style.overflowY = "";
        }

        return () => {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.width = "";
            body.style.overflowY = "";
        };
    }, [showOptions]);

    const handleRemoveFromWatchHistory = async () => {
        try {
            const videoId = _id;
            await api.delete(`/user/delete-from-history/${videoId}`);
            setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
            setShowOptions(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error removing video from watch history:', error.response?.data?.message || error.message);
            } else {
                console.log('Unexpected error while removing video from watch history:', error);
            }
        }
    }

    return (
        <div className='w-full flex gap-3 sm:gap-5 items-start p-1 rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1)] group cursor-pointer hover:shadow-xl transition-shadow duration-300' onClick={() => router.push(`/video/${_id}`)}>
            <div className='w-full max-w-40 sm:max-w-56 lg:max-w-sm aspect-video rounded-[10px] relative '>
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    objectFit='cover'
                    className='rounded-[10px]'
                    loading='lazy'
                />
                <div className='w-full h-full absolute inset-0 bg-black/40 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='w-full h-full flex justify-center  items-center'>
                        <Image width={40} height={40} src={"/play_icon.svg"} alt='play icon' objectFit='cover'/>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-between gap-2 items-start'>
                <div className='space-y-1 sm:space-y-3 flex flex-col justify-between sm:justify-start mt-1 sm:mt-3 '>
                    <h2 className='font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl text-[#1E293B] duration-200'>{title.length > 35 ? title.slice(0, 35) + "..." : title}</h2>
                    <div className=''>
                        <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-600'>{fullName}</p>
                        <p className='text-xs sm:text-sm md:text-base  text-gray-600'>{views} views</p>
                    </div>
                </div>

                <button className='mt-1 sm:mt-3 relative cursor-pointer' onClick={(e) => {
                    e.stopPropagation()
                    setShowOptions(prev => !prev)
                }}>
                    <EllipsisVertical />
                    {
                        showOptions &&
                        <>
                            <div className='fixed w-full h-full bg-black/40 top-0 left-0 z-50 '>
                            </div>
                            <ul className='w-64 sm:w-72 text-sm sm:text-base absolute bg-[#F8FAFC] z-50 translate-y-1 right-0 rounded-md px-1.5 sm:px-3 py-1 flex flex-col items-start space-y-1 duration-150 ease-in' >
                                <li className='w-full p-1 rounded-sm hover:bg-[#E2E8F0] flex gap-1 items-center justify-start' onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromWatchHistory();
                                }}><Trash2 className='w-[18px] sm:w-[20px] active:bg-[#E2E8F0]' />Remove from Watch History</li>
                            </ul>
                        </>
                    }
                </button>
            </div>
        </div>
    )
}

export default WatchHistoryVideoCard