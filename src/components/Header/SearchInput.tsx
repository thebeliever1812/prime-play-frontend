"use client"
import React, { useState } from "react"
import { Plus_Jakarta_Sans } from "next/font/google"
import Image from "next/image"
import { useRouter } from "next/navigation"

const plusJakartaSans = Plus_Jakarta_Sans({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
})

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const router = useRouter()

    return (
        <div className="relative w-full max-w-[165px] sm:max-w-[400px]">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#CBD5E1] rounded-full bg-white hover:border-[#94A3B8] transition-colors">
                <Image
                    src="/search_icon.png"
                    alt="Search"
                    width={20}
                    height={20}
                />
                <input
                    type="search"
                    placeholder="Search video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                            router.push(`/?search=${encodeURIComponent(searchQuery)}`)
                        }
                    }}
                    className={`w-full bg-transparent outline-none text-sm sm:text-base placeholder-[#475569] ${plusJakartaSans.className}`}
                />
            </div>
        </div>
    )
}

export default SearchInput
