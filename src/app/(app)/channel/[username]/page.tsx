import { VideoCard } from '@/components'
import React from 'react'

const Channel = async ({ params }: { params: Promise<{ username: string }> }) => {
    return (
        <div className='w-full bg-amber-300'>
            {/* <VideoCard /> */}
        </div>
    )
}

export default Channel