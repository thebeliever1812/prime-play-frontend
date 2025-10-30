import React from 'react'
import { SidebarItems } from './index';
import { X } from 'lucide-react';

interface SidebarProps {
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({ showMenu, setShowMenu }) => {
    return (
        <aside className=''>
            <div className={`fixed w-full h-screen bg-black/40 backdrop-blur-[2px] top-0 z-50 ${showMenu ? 'block' : 'hidden'}`} onClick={() => setShowMenu(false)}>
            </div>
            <div className={`fixed bg-white w-full max-w-80 h-screen left-0 top-0 z-[60] px-6 py-3 overflow-y-auto transition-transform duration-500 ease-out ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <X size={28} className='mt-1 mb-3 cursor-pointer' onClick={() => setShowMenu(false)}/>
                <SidebarItems setShowMenu={setShowMenu} />
            </div>
        </aside>
    )
}

export default Sidebar