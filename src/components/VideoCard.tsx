"use client"
import Image from 'next/image'
import React from 'react'
import { formatDistanceToNow } from 'date-fns';
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface VideoCardProps {
    _id?: string;
    title: string;
    description: string;
    uploadDate: string;
    thumbnail: string;
    views: number;
    avatarUrl?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ _id, title, description, uploadDate, thumbnail, views, avatarUrl }) => {
    const formattedUploadDate = formatDistanceToNow(new Date(uploadDate), { addSuffix: true });

    const router = useRouter();
    return (
        <div className='w-full max-w-md rounded-lg shadow-md p-1 cursor-pointer hover:shadow-2xl transition-shadow duration-300 group' onClick={() => router.push(`/video/${_id}`)}>
            <div className='w-full aspect-video rounded-lg relative overflow-hidden '>
                <Image
                    src={thumbnail}
                    alt={title}
                    layout='fill'
                    objectFit='cover'
                    className='rounded-lg'
                    loading='lazy'
                />
                {/* Play button overlay */}
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-300'>
                    <Play size={48} className='text-white' />
                </div>
            </div>
            {/* Video details */}
            <div className='w-full px-2 flex items-start gap-2 mt-4 mb-2'>
                {avatarUrl && (
                    <div className='w-10 h-10 relative rounded-full overflow-hidden shrink-0'>
                        <Image
                            src={avatarUrl}
                            alt='Avatar'
                            fill
                            className='rounded-full'
                        />
                    </div>
                )}
                <div>
                    <h2 className='font-semibold text-lg'>{title}</h2>
                    <p className='text-sm text-gray-700'>{description.substring(0, 100)}...</p>
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