import Link from 'next/link'
import React from 'react'

interface DashboardLinkItemProps {
    label: string
    path: string
}

const DashboardLinkItem = ({ label, path }: DashboardLinkItemProps) => {
    return (
        <Link href={path} className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 active:bg-gray-300 duration-150 ease-in-out">
            {label}
        </Link>
    )
}

export default DashboardLinkItem