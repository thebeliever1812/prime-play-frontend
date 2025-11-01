import Image from 'next/image';
import React from 'react'

interface ChannelData {
    _id: string;
    avatar: string;
    channelsSubscribedToCount: number;
    coverImage: string;
    email: string;
    fullName: string;
    isSubscribed: boolean;
    subscribersCount: number;
    username: string;
}

const ChannelInfo: React.FC<{ channelData: ChannelData | null }> = ({ channelData }) => {
    
    return (
        <div className='w-full pt-3 pb-3'>
            <div className='w-full h-32 sm:h-56 relative'>
                {/* Cover image */}
                <div className='w-full h-full overflow-hidden relative rounded-2xl rounded-bl-none'>
                    <Image src={channelData?.coverImage || "/default_cover_image.jpeg"} alt='Cover Image' fill className='object-cover rounded-2xl rounded-bl-none' />
                </div>
                {/* Profile Image */}
                <div className='aspect-square rounded-full w-32 sm:w-52 absolute bottom-0 left-0 translate-y-1/2 '>
                    <div className='w-full h-1/2 overflow-hidden relative rounded-t-full border-2 sm:border-4 border-b-0 sm:border-b-0 border-white'>
                    </div>
                    <Image src={channelData?.avatar || "/default_avatar.png"} alt='Avatar' fill className='object-cover' />
                </div>
            </div>
            {
                channelData ? (
                    <div className='mt-16 sm:mt-[100px] px-4 sm:px-8 duration-200'>
                        <h1 className='text-2xl sm:text-3xl font-bold'>{channelData?.fullName}</h1>
                        <p className='text-sm text-gray-600'>{channelData?.username}</p>
                        <div className='text-sm text-gray-700'>
                            <span>{channelData?.subscribersCount} subscribers</span> • <span>Subscribed to {channelData?.channelsSubscribedToCount} channels</span>
                        </div>
                    </div>
                ) : (
                    <div className='mt-16 sm:mt-[100px] px-4 sm:px-8 duration-200'>
                        <h1 className='text-2xl sm:text-3xl font-semibold'>Channel not found</h1>
                    </div>
                )
            }
        </div>
    )
}

export default ChannelInfo