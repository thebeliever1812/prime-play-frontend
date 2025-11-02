import { AboutChannelOwner } from '@/components'
import React from 'react'

const About = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params
    return (
        <AboutChannelOwner username={username} />
    )
}

export default About