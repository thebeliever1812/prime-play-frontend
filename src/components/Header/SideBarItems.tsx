import React from 'react'

const SidebarItems = () => {
    const sidebarItems = ["Watch History", "Liked Videos", "My Playlist", "My Videos", "Settings", "Send Feedback"]
    return (
        <ul className='w-full space-y-2 mb-15'>
            {
                sidebarItems.map((item, index) => (
                    <li key={index} className='px-4 py-2 rounded-lg bg-[#BBF7D0] cursor-pointer hover:bg-[#22C55E] duration-200 hover:shadow-2xs active:bg-white select-none'>
                        {item}
                    </li>
                ))
            }
        </ul>
    )
}

export default SidebarItems