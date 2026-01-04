"use client"
import { UploadVideoForm } from '@/components/UploadPage'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hook'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Container, CustomLoader } from '@/components'
import Link from 'next/link'

const UploadPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const isLoadingUser = useAppSelector((state) => state.user.loading)
    const user = useAppSelector((state) => state.user.user)
    const isAuthenticated = !!user

    const router = useRouter()

    useEffect(() => {
        setLoading(isLoadingUser)
    }, [isLoadingUser])

    if (loading) {
        return (<Container className='w-full flex justify-center items-center'>
            <CustomLoader />
        </Container>
        )
    }

    if (!isLoadingUser && !isAuthenticated) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <p className="text-gray-600">Please login to view your videos. <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </Container>)
    }

    return (
        <Container className=''>
            <UploadVideoForm />
        </Container>
    )
}

export default UploadPage