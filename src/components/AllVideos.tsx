"use client"
import { Container, VideoCard, VideoCardSkeleton } from '@/components'
import { api } from '@/utils/api';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

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
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isFetchingNext, setIsFetchingNext] = useState<boolean>(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchNextVideos = async () => {
        if (!hasMore || isFetchingNext) return;

        setIsFetchingNext(true);

        try {
            const res = await api.get("/video/all-videos", {
                params: {
                    cursor: nextCursor,
                    limit: 3,
                },
            });

            setVideos(prev => [...prev, ...res.data.data.videos]);
            setNextCursor(res.data.data.nextCursor);
            setHasMore(!!res.data.data.nextCursor);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Error fetching next videos:", error.response?.data?.message || error.message);
            } else {
                console.log("Unexpected error while fetching next videos:", error);
            }
        } finally {
            setIsFetchingNext(false);
        }
    };

    const observer = useRef<IntersectionObserver | null>(null);

    const lastVideoRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNext) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNextVideos();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isFetchingNext, hasMore, nextCursor]
    );

    useEffect(() => {
        const fetchInitialVideos = async () => {
            try {
                const response = await api.get('/video/all-videos', {
                    params: { limit: 6 },
                });
                setVideos(response.data?.data.videos || []);
                setNextCursor(response.data.data.nextCursor);
                setHasMore(!!response.data.data.nextCursor);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching my videos:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching my videos:', error);
                }
            } finally {
                setIsInitialLoading(false);
            }
        }

        fetchInitialVideos();
    }, []);

    if (isInitialLoading) {
        return (<Container className="max-w-6xl py-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
                <VideoCardSkeleton key={index} />
            ))}
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
            {videos.map((video, index) => {
                const isLast = index === videos.length - 1;
                return (<div className='w-full' ref={isLast ? lastVideoRef : null} key={video._id}>
                    <VideoCard
                        _id={video._id}
                        title={video.title}
                        description={video.description}
                        uploadDate={video.createdAt}
                        thumbnail={video.thumbnail}
                        views={video.views}
                        avatarUrl={video.ownerInfo.avatar}
                        username={video.ownerInfo.username}
                        fullName={video.ownerInfo.fullName}
                    />
                </div>)
            }
            )}
            {isFetchingNext && (
                <>
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                </>
            )}
        </Container>
    )
}

export default AllVideos