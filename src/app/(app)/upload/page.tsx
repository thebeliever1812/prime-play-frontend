"use client"
import { UploadVideoForm } from '@/components/UploadPage'
import React, { useEffect } from 'react'
import { useAppSelector } from '@/lib/hook'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Container, CustomLoader } from '@/components'

const UploadPage = () => {
    const isLoadingUser = useAppSelector((state) => state.user.loading)
    const user = useAppSelector((state) => state.user.user)
    const isAuthenticated = !!user

    const router = useRouter()

    useEffect(() => {
        if (!isLoadingUser && !isAuthenticated) {
            toast.error("Please login to upload video")
            router.replace("/login")
        }
    }, [isLoadingUser, isAuthenticated, router])

    return (
        <Container className='relative'>
            {
                isLoadingUser ? <CustomLoader /> : <UploadVideoForm />
            }
        </Container>
    )
}

export default UploadPage