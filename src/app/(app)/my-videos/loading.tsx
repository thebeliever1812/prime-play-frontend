import { Container, CustomLoader } from '@/components'
import React from 'react'

const Loading = () => {
    return (
        <Container className="max-w-6xl flex justify-center items-center">
            <CustomLoader />
        </Container>
    )
}

export default Loading