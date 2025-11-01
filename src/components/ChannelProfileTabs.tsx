"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface ChannelProfileTabsProps {
    username: string | undefined
}

const ChannelProfileTabs: React.FC<ChannelProfileTabsProps> = ({ username }) => {
    const tabs = [{ option: "Videos", path: "" }, { option: "About", path: "about" }, { option: "Playlist", path: "playlist" }]

    const pathname = usePathname()

    if (!username) return <div>
        No username provided
    </div>

    return (
        <div className='w-full px-5 py-2 flex gap-4 sm:gap-6 border-b-[1px] border-gray-300 '>
            {
                tabs.map((tab) => {
                    const isActive = pathname === `/channel/${username}/${tab.path}` || (tab.path === "" && pathname === `/channel/${username}`)
                    return <Link href={`/channel/${username}/${tab.path}`} key={tab.path} className={`px-2 py-1 rounded-b-md duration-200 ${isActive ? "font-medium bg-linear-to-b from-white to-gray-200" : "font-normal text-gray-600 hover:text-gray-800"}`}>
                        {tab.option}
                    </Link>
                }
                )
            }
        </div>
    )
}

export default ChannelProfileTabs