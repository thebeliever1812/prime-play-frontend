"use client"
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from '@/components'
import { UserRegisterSchema } from "@/schemas/userRegister.schema"
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Inputs = z.infer<typeof UserRegisterSchema>

const RegisterForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(UserRegisterSchema)
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await api.post("/user/register", data)
      toast.success(response.data?.message)
      router.replace("/login")
    } catch (error) {
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className='space-y-3'>
      <div className='flex justify-between gap-3 w-full'>
        <div className='space-y-3 w-full'>
          <FormInput<Inputs> type='text' label='Username' name='username' register={register} placeholder='Enter your username' required error={errors.username?.message} />
          <FormInput<Inputs> type='text' label='Full Name' name='fullName' register={register} placeholder='Enter your full name' required error={errors.fullName?.message} />
        </div>
        <div className='space-y-3 w-full'>
          <FormInput<Inputs> type='file' label='Avatar Image' name='avatar' register={register} error={errors.avatar?.message as string | undefined} />
          <FormInput<Inputs> type='file' label='Cover Image' name='coverImage' register={register} error={errors.coverImage?.message as string | undefined} />
        </div>
      </div>
      <div className='space-y-3 w-full'>
        <FormInput<Inputs> type='email' label='Email' name='email' register={register} placeholder='Enter your email' required error={errors.email?.message} />
        <FormInput<Inputs> type='password' label='Password' name='password' register={register} placeholder='Enter your password' required error={errors.password?.message} />
      </div>

      <button type="submit" className='bg-[#4F46E5] text-white w-full rounded-[10px] h-[35px] mt-3 cursor-pointer' >
        Register
      </button>
    </form>
  )
}

export default RegisterForm