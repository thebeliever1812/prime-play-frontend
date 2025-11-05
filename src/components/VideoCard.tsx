"use client"
import Image from 'next/image'
import React from 'react'
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface VideoCardProps {
    _id?: string;
    username?: string
    title: string;
    description: string;
    uploadDate: string;
    thumbnail: string;
    views: number;
    avatarUrl?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ _id, title, description, uploadDate, thumbnail, views, avatarUrl, username }) => {
    const formattedUploadDate = formatDistanceToNow(new Date(uploadDate), { addSuffix: true });

    const router = useRouter();
    return (
        <div className='w-full max-w-md rounded-lg shadow-md p-1 cursor-pointer hover:shadow-xl transition-shadow duration-300 group' onClick={() => router.push(`/video/${_id}`)}>
            <div className='w-full aspect-video rounded-lg relative overflow-hidden '>
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    objectFit='cover'
                    className='rounded-lg'
                    loading='lazy'
                />
                {/* Play button overlay */}
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-300'>
                    <Image width={40} height={40} src={"/play_icon.svg"} alt='play icon' objectFit='cover' />
                </div>
            </div>
            {/* Video details */}
            <div className='w-full px-2 flex items-start gap-2 mt-4 mb-2'>
                {avatarUrl && (
                    <div className='w-10 h-10 relative rounded-full overflow-hidden shrink-0' onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/channel/${username}`)
                    }}>
                        <Image
                            src={avatarUrl}
                            alt='Avatar'
                            fill
                            className='rounded-full'
                        />
                    </div>
                )}
                <div>
                    <h2 className='font-semibold text-lg'>{title.length > 55 ? `${title.substring(0, 55)}...` : title}</h2>
                    <p className='text-sm text-gray-700'>{description.length > 70 ? `${description.substring(0, 70)}...` : description}</p>
                    <div className='w-full flex items-center justify-between mt-2'>
                        <span className='text-xs text-gray-500'>Uploaded: {formattedUploadDate}</span>
                        <span className='text-xs text-gray-500'>{views} views</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard