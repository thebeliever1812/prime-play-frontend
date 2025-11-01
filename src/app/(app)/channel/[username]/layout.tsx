import { ChannelInfo, ChannelProfileTabs, Container } from "@/components";
import { api } from "@/utils/api";
import axios from "axios";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

interface ChannelData {
    _id: string;
    avatar: string;
    channelsSubscribedToCount: number;
    coverImage: string;
    email: string;
    fullName: string;
    isSubscribed: boolean;
    subscribersCount: number;
    username: string;
}

export default async function ChannelLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ username: string }> }>) {
    const { username } = await params;
    let channelData: ChannelData | null = null;
    try {
        const response = await api.get(`/user/channel/${username}`);
        channelData = response.data?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Error fetching channel data in layout:', error.response?.data?.message || error.message);
        } else {
            console.log('Unexpected error while fetching channel data in layout:', error);
        }
    }
    return (
        <div className={`${poppins.className}`}>
            <Container className='w-full max-w-6xl '>
                <ChannelInfo channelData={channelData} />
                <ChannelProfileTabs username={channelData?.username} />
                {children}
            </Container>
        </div>
    );
}
