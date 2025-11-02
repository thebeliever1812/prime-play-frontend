import React from 'react'

const CustomLoader = () => {
    return (
        <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.7s]"></div>
        </div>
    )
}

export default CustomLoader