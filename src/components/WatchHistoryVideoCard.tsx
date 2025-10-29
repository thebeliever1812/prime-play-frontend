import Image from 'next/image'
import React from 'react'

interface WatchHistoryVideoCardProps {
    title: string;
    thumbnail: string;
    avatar: string;
    views: number;
    fullName: string;
}

const WatchHistoryVideoCard: React.FC<WatchHistoryVideoCardProps> = ({ title, thumbnail, avatar, views, fullName }) => {
    return (
        <div className='w-full flex gap-3 sm:gap-5 items-start p-1 rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1)] '>
            <div className='w-full max-w-40 sm:max-w-56 lg:max-w-sm aspect-video rounded-[10px] relative'>
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    objectFit='cover'
                    className='rounded-[10px]'
                    loading='lazy'
                />
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