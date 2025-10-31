import { ChannelInfo, Container } from '@/components'
import React from 'react'

const Channel = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params
    return (
        <Container className='w-full max-w-6xl bg-amber-200'>
            <ChannelInfo username={username} /> 
        </Container>
    )
}

export default Channel