"use client"
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from '@/components'
import { UserLoginSchema } from "@/schemas/userLogin.schema"
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { api } from '@/utils/api';

type Inputs = z.infer<typeof UserLoginSchema>

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(UserLoginSchema)
    })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await api.post("/user/login", data)
            toast.success(response.data?.message)
            router.replace("/")
        } catch (error) {
            toast.error(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || "Something went wrong"
                    : error instanceof Error ? error?.message : "Unexpected error"
            );
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-6 bg-white shadow-md rounded-lg'>
            <div className='space-y-4'>
                <FormInput<Inputs>
                    type='email'
                    label='Email'
                    name='email'
                    register={register}
                    placeholder='Enter your email'
                    required
                    error={errors.email?.message}
                />
                <FormInput<Inputs>
                    type='password'
                    label='Password'
                    name='password'
                    register={register}
                    placeholder='Enter your password'
                    required
                    error={errors.password?.message}
                />
            </div>

            <button
                type="submit"
                className={`flex justify-center items-center gap-2 text-white w-full rounded-lg h-12 mt-4 transition duration-300 ease-in-out cursor-pointer ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 "}`}
                disabled={isSubmitting}
            >
                {isSubmitting ? `Logging in...` : "Log in"}
                {isSubmitting && <Loader2 className='animate-spin' />}
            </button>
        </form>
    )
}

export default LoginForm