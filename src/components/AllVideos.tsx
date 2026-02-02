"use client"
import { Container, VideoCard, VideoCardSkeleton } from '@/components'
import { api } from '@/utils/api';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from "next/navigation"
import { VideoOff } from 'lucide-react';

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
    duration: number;
}

const AllVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isFetchingNext, setIsFetchingNext] = useState<boolean>(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const searchParams = useSearchParams()
    const search = searchParams.get("search") || ""

    const fetchNextVideos = async () => {
        if (!hasMore || isFetchingNext) return;

        setIsFetchingNext(true);

        try {
            const res = await api.get("/video/all-videos", {
                params: {
                    cursor: nextCursor,
                    limit: 3,
                    search,
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
        [isFetchingNext, hasMore, nextCursor, fetchNextVideos]);

    useEffect(() => {
        const fetchInitialVideos = async () => {
            try {
                const response = await api.get('/video/all-videos', {
                    params: {
                        limit: 6,
                        search,
                    },
                });

                console.log(response.data?.data.videos)
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
    }, [search]);

    if (isInitialLoading) {
        return (<Container className="max-w-6xl py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
                <VideoCardSkeleton key={index} />
            ))}
        </Container>
        )
    }

    if (!isInitialLoading && videos.length === 0) {
        return (
            <Container className="max-w-6xl">
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <VideoOff className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-black mb-2">No videos found</h2>
                    <p className="text-gray-500 text-center max-w-md">
                        {search
                            ? `We couldn't find any videos matching "${search}". Try different keywords.`
                            : "There are no videos available at the moment."
                        }
                    </p>
                </div>
            </Container>
        )
    }

    return (
        <Container className="max-w-6xl py-4">
            {search && !isFetchingNext && (
                <p className="text-muted-foreground mb-6 animate-fade-in">
                    Search results for &apos;<span className="text-foreground font-medium">{search}</span>&apos;
                </p>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                            duration={video.duration}
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
            </div>

        </Container>
    )
}

export default AllVideos