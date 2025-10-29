import VideoPlayer from '@/components/VideoPlayer'
import React from 'react'

const Video = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    return (
        <VideoPlayer id={id} />
    )
}

export default Video