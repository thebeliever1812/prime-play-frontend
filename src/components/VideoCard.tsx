import Image from 'next/image'
import React from 'react'

const VideoCard = () => {
    return (
        <div className='w-full max-w-md h-80 rounded-lg shadow-md p-1 cursor-pointer hover:shadow-2xl transition-shadow duration-300' >
            <div className='w-full bg-amber-500 h-4/6 rounded-lg relative overflow-hidden'>
                <Image
                    src='/sample_thumbnail.jpg'
                    alt='Video Title'
                    layout='fill'
                    objectFit='cover'
                    className='rounded-lg'
                />
            </div>
            <div className='px-2 flex flex-col gap-1 mt-2'>
                <h2 className='font-semibold text-lg mt-2'>Video Title</h2>
                <p className='text-sm text-gray-700'>This is a brief description of the video content.</p>
                <div>
                    <span className='text-xs text-gray-500'>Uploaded on: 2023-01-01</span>
                </div>
            </div>
        </div>
    )
}

export default VideoCard