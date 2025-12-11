"use client"
import { Container } from '@/components'
import { api } from '@/utils/api';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Subscriber {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
}

interface SubscriberData {
    _id: string;
    subscriber: Subscriber;
    createdAt: string;
}

const Subscribers = () => {
    const [loadingSubscribersData, setLoadingSubscribersData] = useState(true);
    const [subscribersData, setSubscribersData] = useState<SubscriberData[]>([]);

    useEffect(() => {
        const fetchSubscribersData = async () => {
            try {
                const response = await api.get('/user/subscribers');
                setSubscribersData(response.data?.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('Error fetching subscribers data:', error.response?.data?.message || error.message);
                } else {
                    console.log('Unexpected error while fetching subscribers data:', error);
                }
            } finally {
                setLoadingSubscribersData(false);
            }
        };

        fetchSubscribersData();
    }, []);

    const router = useRouter();

    return (
        <Container className='max-w-6xl py-4 '>
            <div className='mb-8'>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
                    My Subscribers
                </h1>
                <p className='text-gray-600 mt-2'>Track and manage your subscriber community</p>
            </div>
            <div className='space-y-6'>
                {/* Subscribers Count */}
                <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white'>
                    <p className='text-sm font-medium opacity-90'>Total Subscribers</p>
                    <h2 className='text-4xl font-bold mt-2'>{loadingSubscribersData ? <Loader className='inline-block animate-spin' /> : subscribersData.length}</h2>
                </div>

                {/* Subscribers List */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {loadingSubscribersData ? (
                        <div className='col-span-3 w-full text-center py-8 text-gray-500'>
                            <Loader className='mx-auto mb-2 animate-spin' />
                        </div>
                    ) : (
                            subscribersData.map((subscriberData, index) => {
                                const formattedDate = formatDistanceToNow(new Date(subscriberData.createdAt), { addSuffix: true });
                                return <div key={index} className='flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer' onClick={() => router.push(`/channel/${subscriberData.subscriber.username}`)}>
                                    <Image width={48} height={48} src={subscriberData.subscriber.avatar} alt={subscriberData.subscriber.fullName} className='rounded-full' />
                                    <div className='flex-1'>
                                        <p className='font-medium text-gray-900'>{subscriberData.subscriber.fullName}</p>
                                        <p className='text-sm text-gray-500'>{`Joined ${formattedDate}`}</p>
                                    </div>
                                </div>
                        })
                    )}
                </div>
            </div>
        </Container>
    )
}

export default Subscribers