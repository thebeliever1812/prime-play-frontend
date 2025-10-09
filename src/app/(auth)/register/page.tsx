"use client"
import { Container, FormInput } from '@/components'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});


type Inputs = {
    username: string,
    fullName: string,
    email: string,
    password: string,
    avatar: FileList,
    coverImage: FileList
}

const Register = () => {
    const {
        register,
        handleSubmit
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {

    }

    return (
        <Container className='max-w-4xl flex justify-center items-center'>
            <div className={`w-full max-w-2xl rounded-xl px-5 py-8 shadow-[5px_5px_15px_1px_#BEBEBE] space-y-10 ${poppins.className}`}>
                <div className=''>
                    <h1 className='w-full max-w-md mx-auto text-center text-[36px] font-medium '>Welcome to Prime Play</h1>
                    <p className='w-full max-w-lg mx-auto text-center text-[16px] font-medium  '>Join the Ultimate Video Community</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className='space-y-3'>
                    <div className='flex justify-between gap-3 w-full'>
                        <div className='space-y-3 w-full'>
                            <FormInput<Inputs> type='text' label='Username' name='username' register={register} placeholder='Enter your username' required />
                            <FormInput<Inputs> type='text' label='Full Name' name='fullName' register={register} placeholder='Enter your full name' required />
                        </div>
                        <div className='space-y-3 w-full'>
                            <FormInput<Inputs> type='file' label='Avatar Image' name='avatar' register={register} />
                            <FormInput<Inputs> type='file' label='Cover Image' name='coverImage' register={register} />
                        </div>
                    </div>
                    <div className='space-y-3 w-full'>
                        <FormInput<Inputs> type='email' label='Email' name='email' register={register} placeholder='Enter your email' required />
                        <FormInput<Inputs> type='password' label='Password' name='password' register={register} placeholder='Enter your password' required />
                    </div>

                    <button type="submit" className='bg-[#4F46E5] text-white w-full rounded-[10px] h-[35px] mt-3' >
                        Register
                    </button>
                </form>
                <div className='flex justify-center gap-2 items-center'>
                    <p>Have a account? <Link href={"/login"} className='text-[#4F46E5]'>Sign In</Link></p>
                </div>
            </div>
        </Container>
    )
}

export default Register