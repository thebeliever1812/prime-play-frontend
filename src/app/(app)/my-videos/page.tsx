import { Container, VideoCard } from '@/components'
import React from 'react'

const MyVideos = () => {
    return (
        <Container className="max-w-6xl py-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
        </Container>

    )
}

export default MyVideos