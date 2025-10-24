"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

interface SidebarItemsProps {
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ setShowMenu }) => {

    const sidebarItems = [
        {
            label: "Watch History",
            path: "/watch-history"
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
            label: "My Videos",
            path: "/my-videos"
        },
        {
            label: "Settings",
            path: "/settings"
        },
        {
            label: "Send Feedback",
            path: "/send-feedback"
        },
    ]

    const pathname = usePathname()

    return (
        <ul className='w-full space-y-2 mb-15'>
            {
                sidebarItems.map((item, index) => {
                    let isActive = item.path === pathname
                    return <li key={index} className={`w-full rounded-lg cursor-pointer hover:bg-[#22C55E] duration-200 hover:shadow-2xs active:bg-white select-none ${isActive ? "bg-[#22C55E]" : "bg-[#BBF7D0]"}`} onClick={() => setShowMenu(false)}>
                        <Link href={item.path} className='w-full block px-4 py-2 rounded-lg'>{item.label}</Link>
                    </li>
                })
            }
        </ul>
    )
}

export default SidebarItems