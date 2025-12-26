"use client"
import { Container, VideoCard } from '@/components'
import { api } from '@/utils/api';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface Owner {
    _id: string;
    username: string;
    avatar: string;
    fullName: string;
}

interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    views: number;
    ownerInfo: Owner;
}

const AllVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/video/all-videos');
                setVideos(response.data?.data || []);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching my videos:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching my videos:', error);
                }
            } finally {
                setLoadingVideos(false);
            }
        }

        fetchVideos();
    }, []);

    if (loadingVideos) {
        return (<Container className="max-w-6xl flex justify-center items-center">
            <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:.7s]"></div>
            </div>
        </Container>
        )
    }

    if (videos.length === 0) {
        return (
            <Container className="max-w-6xl py-4 flex justify-center items-center">
                <p className="text-gray-600">No videos found</p>
            </Container>
        )
    }

    return (
        <Container className="max-w-6xl py-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-start justify-items-center">
            {videos.map(video => (<VideoCard
                key={video._id}
                _id={video._id}
                title={video.title}
                description={video.description}
                uploadDate={video.createdAt}
                thumbnail={video.thumbnail}
                views={video.views}
                avatarUrl={video.ownerInfo.avatar}
                username={video.ownerInfo.username}
                fullName={video.ownerInfo.fullName}
            />)
            )}
        </Container>
    )
}

export default AllVideos