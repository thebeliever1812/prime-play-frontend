"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

interface WatchHistoryVideoCardProps {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    fullName: string;
}

const WatchHistoryVideoCard: React.FC<WatchHistoryVideoCardProps> = ({ _id, title, thumbnail, views, fullName }) => {
    const router = useRouter()
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
            <div className='space-y-1 sm:space-y-3 flex flex-col justify-between sm:justify-start mt-1 sm:mt-3'>
                <h2 className='font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl text-[#1E293B] duration-200'>{title}</h2>
                <div className=''>
                    <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-600'>{fullName}</p>
                    <p className='text-xs sm:text-sm md:text-base  text-gray-600'>{views} views</p>
                </div>
            </div>
        </div>
    )
}

export default WatchHistoryVideoCard