import { FetchChannelVideo } from '@/components'
import React from 'react'

const ChannelVideos = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params

    return (
        <FetchChannelVideo username={username} />
    )
}

export default ChannelVideos