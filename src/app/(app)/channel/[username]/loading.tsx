import { Container } from '@/components'
import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
    return (
        <Container className="max-w-6xl flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8" />
        </Container>
    )
}

export default Loading