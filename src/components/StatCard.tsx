import React from 'react'

interface StatCardProps {
    statNumber: number;
    statName: string;
}

const StatCard = ({ statNumber = 0, statName }: StatCardProps) => {
    return (
        <div className='text-center'>
            <p className='text-2xl sm:text-3xl font-bold text-[#1E293B]'>{statNumber}</p>
            <p className='text-sm text-gray-600'>{statName}</p>
        </div>
    )
}

export default StatCard