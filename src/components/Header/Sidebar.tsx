"use client"

import React from 'react'
import { SidebarItems } from './index';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({ showMenu, setShowMenu }) => {
    const router = useRouter()
    return (
        <aside className=''>
            <div className={`fixed w-full h-screen bg-black/40 backdrop-blur-[2px] top-0 z-50 ${showMenu ? 'block' : 'hidden'}`} onClick={() => setShowMenu(false)}>
            </div>
            <div className={`fixed bg-white w-full max-w-80 h-screen left-0 top-0 z-[60] px-2 py-3 overflow-y-auto transition-transform duration-500 ease-out ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <div className='flex items-center justify-between mb-3 px-4'>
                    <div className='w-6 sm:w-7 aspect-square relative cursor-pointer' onClick={() => router.push("/")}>
                        <Image src={"/logo.png"} alt='Prime play logo' fill />
                    </div>
                    <X className='w-6 h-6 mt-1 mb-3 cursor-pointer' onClick={() => setShowMenu(false)} />
                </div>

                <SidebarItems setShowMenu={setShowMenu} />
            </div>
        </aside>
    )
}

export default Sidebar