"use client"
import { Container, CustomLoader, DeletePopUp, DeletionSuccessful, EditProfileCard } from '@/components'
import { clearUser } from '@/lib/features/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/lib/hook'
import { api } from '@/utils/api'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const EditProfile = () => {
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false)
    const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)
    const [deletionSuccessful, setDeletionSuccessful] = useState<boolean>(false)

    const user = useAppSelector((state) => state.user.user)
    const isLoadingUser = useAppSelector((state) => state.user.loading)

    const dispatch = useAppDispatch()

    const isAuthenticated = !!user

    const router = useRouter();

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            const response = await api.delete('/user/delete-account');
            if (response.status === 200) {
                dispatch(clearUser());
                setDeletionSuccessful(true);
            }

            setTimeout(() => {
                setDeletionSuccessful(false);
                router.push('/');
            }, 2000);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error deleting account:', error.response?.data || error.message);
            } else {
                console.log('Unexpected error while deleting account:', error);
            }
        } finally {
            setIsDeletingAccount(false);
        }
    }

    if (isDeletingAccount) {
        return (
            <Container className="max-w-6xl flex justify-center items-center">
                <div className="mx-auto w-[600px rounded-xl overflow-hidden drop-shadow-2xl" >
                    <div className="flex p-8 justify-center items-center h-[450px]">
                        <div className="text-center space-y-6">
                            <div className="w-24 h-24 border-4 border-t-[#4F46E5] border-gray-200 rounded-full animate-spin mx-auto" >
                            </div>
                            <div className="text-[#4F46E5] font-semibold text-4xl opacity-90 animate-fadeIn" >
                                Almost There...
                            </div>
                            <div className="text-gray-700 text-sm  animate-fadeIn">
                                <p>We&apos;re deleting your account...</p>
                                <p>Sit tight for just a moment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    if (deletionSuccessful) {
        return (
            <Container className="max-w-6xl flex justify-center items-center">
                <DeletionSuccessful />
            </Container>
        )
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
            <p className="text-gray-600">Please login to Edit Profile. <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </Container>
        )
    }

    return (
        <div className='w-full'>
            <h1 className='text-4xl font-bold my-8 text-[#1E293B]'>Edit Profile</h1>
            <div className='grid gap-4 md:gap-6'>
                <EditProfileCard
                    title="Change Profile Picture"
                    description="Update your profile photo"
                    onClick={() => router.push('/edit-profile/change-profile-picture')}
                />

                <EditProfileCard
                    title="Change Cover Image"
                    description="Update your cover photo"
                    onClick={() => router.push('/edit-profile/change-cover-image')}
                />

                <EditProfileCard
                    title="Change Password"
                    description="Update your password"
                    onClick={() => router.push('/edit-profile/change-password')}
                />

                <EditProfileCard
                    title="Delete Account"
                    description="Permanently delete your account"
                    variant="danger"
                    onClick={() => {
                        setShowDeletePopup(true)
                    }}
                />
                {
                    showDeletePopup && (
                        <DeletePopUp message='Do you really want to delete your account?' setShow={setShowDeletePopup} deleteAction={handleDeleteAccount} />
                    )
                }
            </div>
        </div>
    )
}

export default EditProfile