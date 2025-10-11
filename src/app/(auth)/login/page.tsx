import React from 'react'
import { Container, LoginForm } from '@/components'
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

const LoginUser = () => {
    return (
        <Container className='max-w-4xl flex justify-center items-center'>
            <div className={`w-full max-w-2xl rounded-xl px-3 sm:px-10 lg:px-15 py-8 shadow-[5px_5px_15px_1px_#BEBEBE] space-y-5 sm:space-y-7 lg:space-y-10 duration-200 ${poppins.className}`}>
                <div className=''>
                    <h1 className='w-full max-w-md mx-auto text-center text-[36px] font-medium '>Welcome to Prime Play</h1>
                    <p className='w-full max-w-lg mx-auto text-center text-[16px] font-medium  '>Join the Ultimate Video Community</p>
                </div>
                <LoginForm />
                <div className='flex justify-center gap-2 items-center'>
                    <p>Don't have a account? <Link href={"/register"} className='text-[#4F46E5]'>Sign Up</Link></p>
                </div>
            </div>
        </Container>
    )
}

export default LoginUser