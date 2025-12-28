"use client"
import { Container, CustomLoader, DashboardLinkItem, DeletePopUp, StatCard } from '@/components'
import { useAppSelector } from '@/lib/hook'
import { api } from '@/utils/api'
import axios from 'axios'
import { Loader2, SquarePen, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface Stats {
    name: string;
    value: number;
}

const Dashboard = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
    const [channelStatsLoading, setChannelStatsLoading] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false);

    const [userData, setUserData] = useState<any>(null);

    const [stats, setStats] = useState<Stats[]>([
        { name: "Views", value: 0 },
        { name: "Likes", value: 0 },
        { name: "Subscribers", value: 0 },
        { name: "Subscriptions", value: 0 },
    ]);

    useEffect(() => setMounted(true), []);

    const user = useAppSelector(state => state.user.user)
    const isLoadingUser = useAppSelector(state => state.user.loading)

    const isAuthenticated = !!user

    const deleteCoverImage = async () => {
        try {
            await api.delete("/user/delete-cover-image")
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

    const dashboardLinks = [
        {
            label: "My Videos",
            path: "/my-videos"
        },
        {
            label: "Liked Videos",
            path: "/liked-videos"
        },
        {
            label: "My Playlist",
            path: "/my-playlist"
        },
        {
            label: "Watch History",
            path: "/watch-history"
        },
        {
            label: "My Subscribers",
            path: "/my-subscribers"
        },
        {
            label: "My Subscriptions",
            path: "/my-subscriptions"
        },
        {
            label: "Edit Profile",
            path: "/edit-profile"
        },
    ]
        
    useEffect(() => {
        const fetchChannelStats = async () => {
            setChannelStatsLoading(true)
            try {
                const response = await api.get("/user/channel-stats")
                console.log("Channel Stats Response:", response.data);

                setStats([
                    { name: "Views", value: response.data.data.totalViews || 0 },
                    { name: "Likes", value: response.data.data.totalLikes || 0 },
                    { name: "Subscribers", value: response.data.data.totalSubscribers || 0 },
                    { name: "Subscriptions", value: response.data.data.totalSubscriptions || 0 },
                ]);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data?.message || "Failed to fetch channel stats")
                } else {
                    console.log("An unexpected error occurred")
                }
            } finally {
                setChannelStatsLoading(false)
            }
        }

        fetchChannelStats()
    }, [])

    if (!mounted) return null;

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
        <Container className='max-w-6xl pt-2'>
            <div className='w-full h-32 sm:h-56 lg:h-72 relative duration-150'>
                <div className='w-full h-full overflow-hidden relative'>
                    <Image src={user.coverImage} alt='Cover Image' fill className='object-cover  rounded-lg sm:rounded-2xl' />
                    <div className='absolute right-0 bottom-0 p-2 flex gap-2 sm:gap-4'>
                        <SquarePen className='text-white cursor-pointer' />
                        <Trash className='text-red-600 cursor-pointer' onClick={() => setShowDeleteConfirm(true)} />
                    </div>
                </div>
                {/* Profile Image */}
                <div className='w-full aspect-square rounded-full max-w-32 sm:max-w-60 lg:max-w-80 absolute top-full left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                    <Image src={user.avatar} alt='Avatar' fill className='object-cover' />
                    <SquarePen className='w-5 sm:w-7 lg:w-10 text-gray-400 cursor-pointer absolute top-full left-1/2 -translate-x-1/2 -translate-y-8 sm:-translate-y-10 lg:-translate-y-11 ' />
                </div>

                <div className='w-full absolute top-[195px] sm:top-[345px] lg:top-[445px] duration-150 '>
                    <h2 className='w-full text-center text-xl sm:text-3xl lg:text-4xl font-semibold text-[#1E293B]'>
                        {user.fullName}
                    </h2>
                    <p className='w-full text-center text-sm sm:text-base lg:text-lg text-gray-600'>
                        {user.username}
                    </p>

                    <div className='w-full h-1 border-b border-gray-300'></div>
                </div>


            </div>
            {
                showDeleteConfirm && (
                    <DeletePopUp message='Do you really want to delete the cover image?' setShow={setShowDeleteConfirm} deleteAction={deleteCoverImage} />
                )
            }

            <div className='mt-[145px] sm:mt-[220px] lg:mt-[270px] duration-150 ease-in'>
                {
                    channelStatsLoading ?
                        <div className='w-full flex justify-center items-center h-10'>
                            <Loader2 className="animate-spin w-8 h-8" />
                        </div> :
                        <div className='w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 px-2 sm:px-6 lg:px-12'>
                            {
                                stats.map((stat, index) => (
                                    <StatCard key={index} statNumber={stat.value} statName={stat.name} />
                                ))
                            }
                        </div>
                }

                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-2 sm:px-6 lg:px-12 overflow-visible'>
                    {dashboardLinks.map((link) => (
                        <DashboardLinkItem key={link.path} label={link.label} path={link.path} />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default Dashboard