"use client"
import { Container, CustomLoader } from '@/components'
import { useAppSelector } from '@/lib/hook'
import Link from 'next/link'
import React from 'react'

const EditProfile = () => {
    const user = useAppSelector((state) => state.user.user)
    const isLoadingUser = useAppSelector((state) => state.user.loading)

    const isAuthenticated = !!user

    if (isLoadingUser) {
        return (
            <Container className="max-w-6xl flex justify-center items-center">
                <CustomLoader />
            </Container>
        )
    }

    if (!isAuthenticated) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <p className="text-gray-600">Please login to Edit Profile. <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </Container>
        )
    }

    return (
        <Container className='max-w-5xl'>
            <h1 className='text-3xl font-semibold my-6 '>Edit Profile</h1>
            <ul className='w-full text-gray-700 bg-[#E2E8F0] rounded-lg flex flex-col'>
                <li className='p-3 border-b border-[#94A3B8] hover:bg-[#CBD5E1] first:rounded-tl-lg first:rounded-tr-lg cursor-pointer'>Change Profile Picture</li>
                <li className='p-3 border-b border-[#94A3B8] hover:bg-[#CBD5E1] cursor-pointer'>Change Cover Image</li>
                <li className='p-3 border-b border-[#94A3B8] hover:bg-[#CBD5E1] cursor-pointer'>Change Password</li>
                <li className='p-3 border-b border-[#94A3B8] hover:bg-[#CBD5E1] last:rounded-bl-lg last:rounded-br-lg last:border-none cursor-pointer'>Delete Account</li>
            </ul>
        </Container>
    )
}

export default EditProfile