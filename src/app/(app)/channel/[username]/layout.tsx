import { ChannelInfo, ChannelProfileTabs, Container } from "@/components";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

export default async function ChannelLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ username: string }> }>) {
    const { username } = await params;

    return (
        <div className={`${poppins.className}`}>
            <Container className='w-full max-w-6xl '>
                <ChannelInfo username={username} />
                <ChannelProfileTabs username={username} />
                {children}
            </Container>
        </div>
    );
}
