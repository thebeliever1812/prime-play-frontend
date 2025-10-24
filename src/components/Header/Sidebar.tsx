import React from 'react'
import { SidebarItems } from './index';

interface SidebarProps {
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({ showMenu, setShowMenu }) => {
    return (
        <aside>
            <div className={`fixed w-full h-screen bg-black/40 backdrop-blur-[2px] z-50 ${showMenu ? 'block' : 'hidden'}`} onClick={() => setShowMenu(false)}>
            </div>
            <div className={`fixed bg-white w-full max-w-80 h-screen left-0 z-[60] px-6 py-3 overflow-y-auto transition-transform duration-500 ease-out ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <SidebarItems setShowMenu={setShowMenu} />
            </div>
        </aside>
    )
}

export default Sidebar