"use client"
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import { api } from '@/utils/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Loader2, TextAlignJustify } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hook'
import { setUser, clearUser, setLoading } from "@/lib/features/user/user.slice"
import { Sidebar } from '@/components/Header'

const plusJakartaSans = Plus_Jakarta_Sans({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const router = useRouter()

    const user = useAppSelector((state) => state.user.user)
    const isLoadingUser = useAppSelector((state) => state.user.loading)
    const dispatch = useAppDispatch()
    const isAuthenticated = !!user

    useEffect(() => {
        const refreshTokensIfRefreshTokenExist = async () => {
            try {
                const response = await api.post("/user/refresh-token")
                if (response.data?.success) {
                    const autoLoggedInUserResponse = await api.get("/auth/session")
                    dispatch(setUser(autoLoggedInUserResponse.data?.data))
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log("Error authenticating user:", error.response?.data?.message)
                } else {
                    console.log("Unexpected error while authenticating user")
                }
                dispatch(clearUser())
            } finally {
                dispatch(setLoading(false))
            }
        }

        const authenticateUser = async () => {
            try {
                const response = await api.get("/auth/session")
                dispatch(setUser(response.data?.data))
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        await refreshTokensIfRefreshTokenExist()
                    } else {
                        console.log("Error authenticating user:", error.response?.data?.message)
                        dispatch(clearUser())
                        dispatch(setLoading(false))
                    }
                } else {
                    console.log("Unexpected error while authenticating user")
                    dispatch(clearUser())
                    dispatch(setLoading(false))
                }
            }
        }
        authenticateUser()
    }, [dispatch])

    const handleLogoutUser = async () => {
        try {
            const response = await api.post("/user/logout")
            dispatch(clearUser())
            setShowProfile(false)
            toast.success(response.data?.message)
            router.replace("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message)
            } else {
                toast.error("Unexpected error: Logout failed")
            }
        }
    }

    const handleDashboard = () => {
        setShowProfile(false)
        router.push("/dashboard")
    }

    const authenticatedProfileOptions = [
        {
            option: "Dashboard",
            method: handleDashboard
        },
        {
            option: "Logout",
            method: handleLogoutUser
        }
    ]

    const unauthenticatedProfileOptions = [
        {
            option: "Log In",
            method: function () {
                router.push('/login')
            }
        },
        {
            option: "Create account",
            method: function () {
                router.push('/register')
            }
        }
    ]
    return (
        <>
            <nav className={`w-full bg-white flex gap-[16px] justify-between px-[12px] py-[10px] sm:px-[24px] sm:py-[12px] border-b-[1px] border-[#E2E8F0] fixed top-0 left-0 z-50 transition-transform duration-300`}>
                <div className='flex items-center gap-2 sm:gap-4'>
                    <div className='cursor-pointer' onClick={() => setShowMenu(!showMenu)}>
                        <TextAlignJustify size={28} />
                    </div>
                    <div className='w-[30px] sm:w-[35px] aspect-square relative cursor-pointer' onClick={() => router.push("/")}>
                        <Image src={"/logo.png"} alt='Prime play logo' fill />
                    </div>
                </div>

                <div className='w-full flex gap-[5px] sm:gap-[12px] justify-end items-center'>
                    {/* Search bar */}
                    <div className='w-full max-w-[165px] sm:max-w-[400px] align-middle px-[12px] py-[8px] border-[#CBD5E1] border-[1px] rounded-[123px] '>
                        <div className='w-full max-w-[296px] flex gap-[8px] items-center justify-between' >
                            <div className='w-4 sm:w-5 aspect-square relative shrink-0'>
                                <Image src={"/search_icon.png"} alt='Search icon' fill />
                            </div>
                            <input type="search" className={`w-full outline-none placeholder-[#475569] text-sm sm:text-base ${plusJakartaSans.className}`} placeholder='Search video...' />
                        </div>
                    </div>
                    {/* Upload Button */}
                    {
                        isLoadingUser ? <>
                            <Loader2 className='animate-spin' />
                        </> : <>
                            {
                                isAuthenticated ?
                                    <Link href={"/upload"} className='w-full max-w-fit flex items-center gap-[8px] px-[16px] py-[10px] bg-[#4F46E5] text-white text-sm sm:text-base rounded-full '>
                                        <div className='w-[15.63px] aspect-square relative shrink-0'>
                                            <Image src={"/upload.png"} fill alt='Upload icon' />
                                        </div>
                                        <span className='hidden sm:block'>
                                            Upload
                                        </span>
                                    </Link>
                                    :
                                    <Link href={"/login"} className='w-full max-w-fit sm:flex sm:items-center gap-[8px] px-[16px] py-[10px] bg-[#4F46E5] text-white text-sm sm:text-base rounded-full hidden'>
                                        Login
                                    </Link>
                            }
                            {/* Profile button */}
                            <div className='relative z-50'>
                                <div className='w-[40px] h-[40px] rounded-full shrink-0 relative cursor-pointer overflow-hidden' onClick={() => setShowProfile(!showProfile)}>
                                    <Image src={user ? user.avatar : "/default_avatar.png"} fill alt='Avatar image of user' />
                                </div>
                                {
                                    showProfile &&
                                    <div className='w-60 sm:w-sm absolute right-0 top-[50px] p-5 rounded-xl flex flex-col sm:flex-row items-center gap-5 duration-200 bg-[#F1F5F9] z-50'>
                                        <div className='flex flex-col items-center w-full sm:max-w-1/2'>
                                            <div className='w-14 sm:w-24 aspect-square relative duration-200 overflow-hidden rounded-full '>
                                                <Image src={user ? user.avatar : "/default_avatar.png"} fill alt='Avatar image of user' />
                                            </div>
                                            {
                                                isAuthenticated && <>
                                                    <h2 className='text-lg'>{user?.fullName}</h2>
                                                    <span className='text-sm'>{user?.username}</span>
                                                </>
                                            }
                                        </div>
                                        <ul className='w-full sm:max-w-1/2 space-y-3'>
                                            {
                                                (isAuthenticated ? authenticatedProfileOptions : unauthenticatedProfileOptions).map((option, index) => (
                                                    <li key={index} className='w-full bg-[#4F46E5] rounded-md px-2 py-1 text-center text-white cursor-pointer hover:bg-[#382DE6] active:text-[#382DE6] active:bg-white select-none' onClick={option.method}>
                                                        {option.option}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                }
                            </div>
                        </>
                    }
                </div>
                {
                    showProfile &&
                    <div className='fixed w-full h-screen left-0 bg-black/40 backdrop-blur-[2px] top-0 z-40' onClick={() => setShowProfile(false)}>
                    </div>
                }
            </nav>
            <div className='w-full h-[61px] sm:h-[69px]'>
            </div>
            <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
        </>
    )
}

export default Navbar