"use client"
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import { api } from '@/utils/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const plusJakartaSans = Plus_Jakarta_Sans({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

interface User {
    _id: string
    username: string
    fullName: string
    email: string
    avatar: string
    coverImage: string
}

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const [showProfile, setShowProfile] = useState(false)

    const router = useRouter()



    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await api.get("/auth/session")
                setIsAuthenticated(response.data?.success)
                setUser(response.data?.data)
            } catch (error) {
                setIsAuthenticated(false)
                if (axios.isAxiosError(error)) {
                    console.log("Error authenticating user:", error.response?.data?.message)
                } else {
                    console.log("Unexpected error while authenticating user")
                }
            } finally {
                setIsLoadingUser(false)
            }
        }
        authenticateUser()
    }, [setIsAuthenticated])

    const handleLogoutUser = async () => {
        try {
            const response = await api.post("/user/logout")
            setIsAuthenticated(false)
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

    const handleEditUser = async () => {

    }

    const authenticatedProfileOptions = [
        {
            option: "Edit",
            method: handleEditUser
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
        <nav className='w-full bg-white flex gap-[16px] justify-between px-[24px] py-[20px] border-b-[1px] border-[#E2E8F0] '>
            <div className='w-full'>

            </div>
            <div className='w-full flex gap-[12px] justify-end items-center'>
                {/* Search bar */}
                <div className='h-[40px] w-full max-w-[320px] align-middle px-[12px] py-[8px] border-[#CBD5E1] border-[1px] rounded-[123px]'>
                    <div className='w-full max-w-[296px] flex gap-[8px] items-center justify-between' >
                        <Image src={"/search_icon.png"} alt='Search icon' width={20} height={20} />
                        <input type="search" className={`w-full outline-none placeholder-[#475569] ${plusJakartaSans.className}`} placeholder='Search our video...' />
                    </div>
                </div>
                {/* Upload Button */}
                {
                    isLoadingUser ? <>
                        <Loader2 className='animate-spin' />
                    </> : <>
                        {
                            isAuthenticated ?
                                <Link href={"/upload"} className='w-full max-w-fit flex gap-[8px] px-[16px] py-[10px] bg-[#4F46E5] text-white rounded-full items-center'>
                                    <Image src={"/upload.png"} width={15.63} height={15.63} alt='Upload icon' />
                                    <span>
                                        Upload
                                    </span>
                                </Link>
                                :
                                <Link href={"/login"} className='w-full max-w-fit flex gap-[8px] px-[16px] py-[10px] bg-[#4F46E5] text-white rounded-full items-center'>
                                    Login
                                </Link>
                        }
                        {/* Profile button */}
                        <div className='relative z-50'>
                            <div className='w-[40px] h-[40px] rounded-full shrink-0 relative cursor-pointer' onClick={() => setShowProfile(!showProfile)}>
                                <Image src={user ? user.avatar : "/default_avatar.png"} fill alt='Avatar image of user' />
                            </div>
                            {
                                showProfile &&
                                <div className='w-60 sm:w-sm absolute right-0 top-[50px] p-5 rounded-xl flex flex-col sm:flex-row items-center gap-5 duration-200 bg-[#F1F5F9]'>
                                    <div className='flex flex-col items-center sm:w-1/2'>
                                        <div className='w-14 sm:w-24 aspect-square relative duration-200 '>
                                            <Image src={user ? user.avatar : "/default_avatar.png"} fill alt='Avatar image of user' />
                                        </div>
                                        {
                                            isAuthenticated && <>
                                                <h2 className='text-lg'>{user?.fullName}</h2>
                                                <span className='text-sm'>{user?.username}</span>
                                            </>
                                        }
                                    </div>
                                    <ul className='sm:grow space-y-3'>
                                        {
                                            (isAuthenticated ? authenticatedProfileOptions : unauthenticatedProfileOptions).map((option, index) => (
                                                <li key={index} className='w-full bg-[#4F46E5] rounded-md px-2 py-1 text-center text-white cursor-pointer hover:bg-[#382DE6]' onClick={option.method}>
                                                    {option.option}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        {
                            showProfile &&
                            <div className='fixed inset-0 bg-black/50 backdrop-blur-xs z-40' onClick={() => setShowProfile(false)}>
                            </div>
                        }
                    </>
                }
            </div>
        </nav>
    )
}

export default Navbar