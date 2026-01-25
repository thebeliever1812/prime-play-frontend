"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { History, ListVideo, MessageSquare, Settings, ThumbsUp, Video } from 'lucide-react'

interface SidebarItemsProps {
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ setShowMenu }) => {

    const sidebarItems = [
        { label: 'Watch History', path: '/watch-history', icon: History },
        { label: 'Liked Videos', path: '/liked-videos', icon: ThumbsUp },
        { label: 'My Playlist', path: '/my-playlist', icon: ListVideo },
        { label: 'My Videos', path: '/my-videos', icon: Video },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Send Feedback', path: '/send-feedback', icon: MessageSquare },
    ];

    const pathname = usePathname()

    return (
        <ul className='w-full space-y-2 mt-4 mb-15'>
            {
                sidebarItems.map((item, index) => {
                    const isActive = item.path === pathname
                    return <li key={index} className={`w-full rounded-lg cursor-pointer hover:bg-[#d8fde5] hover:text-[#1cbd55] hover:shadow-2xs ease-in active:bg-white select-none ${isActive ? "bg-[#d8fde5] text-[#1cbd55]" : "bg-white"}`} onClick={() => setShowMenu(false)}>
                        
                        <Link href={item.path} className='w-full block rounded-lg'>
                            <div className='w-full px-4 py-2 rounded-lg flex justify-start items-center gap-2'>
                                <item.icon className="h-5 w-5 shrink-0" />
                                {item.label}
                            </div>
                        </Link>
                    </li>
                })
            }
        </ul>
    )
}

export default SidebarItems