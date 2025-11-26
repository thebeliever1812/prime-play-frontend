"use client"
import { Container, CustomLoader, DeletePopUp } from '@/components'
import { useAppSelector } from '@/lib/hook'
import { api } from '@/utils/api'
import axios from 'axios'
import { SquarePen, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Dashboard = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

    const user = useAppSelector(state => state.user.user)
    const isLoadingUser = useAppSelector(state => state.user.loading)

    const isAuthenticated = !!user

    const deleteCoverImage = async () => {
        try {
            const response = await api.delete("/user/delete-cover-image")
            toast.success("Cover image deleted successfully")
            setShowDeleteConfirm(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to delete cover image")
            } else {
                toast.error("An unexpected error occurred")
            }
            setShowDeleteConfirm(false)
        }
    }

    if (isLoadingUser) {
        return (
            <Container className="max-w-6xl flex justify-center items-center">
                <CustomLoader />
            </Container>
        )
    }

    if (!isAuthenticated) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <p className="text-gray-600">Please login to view Dashboard. <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </Container>
        )
    }

    return (
        <Container className='max-w-6xl bg-amber-300'>
            <div className='w-full h-32 sm:h-56 lg:h-72 relative'>
                <div className='w-full h-full overflow-hidden relative rounded-2xl'>
                    <Image src={user.coverImage || "/default_cover_image.jpeg"} alt='Cover Image' fill className='object-cover rounded-2xl rounded-bl-none' />
                    <div className='absolute right-0 bottom-0 p-2 flex gap-4'>
                        <SquarePen className='text-white cursor-pointer' />
                        <Trash className='text-red-600 cursor-pointer' onClick={() => setShowDeleteConfirm(true)} />
                    </div>
                </div>
                {/* Profile Image */}
                <div className='aspect-square rounded-full w-32 sm:w-60 lg:w-80 absolute top-[100%] left-[50%] -translate-x-[50%] -translate-y-[50%] '>
                    <Image src={user.avatar || "/default_avatar.png"} alt='Avatar' fill className='object-cover' />
                </div>
            </div>
            {
                showDeleteConfirm && (
                    <DeletePopUp message='Do you really want to delete the cover image?' setShow={setShowDeleteConfirm} deleteAction={deleteCoverImage} />
                )
            }
        </Container>
    )
}

export default Dashboard