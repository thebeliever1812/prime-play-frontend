"use client"
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ImageUploadWithPreview, FormInput } from '@/components'
import { UserRegisterSchema } from "@/schemas/userRegister.schema"
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

type Inputs = z.infer<typeof UserRegisterSchema>

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(UserRegisterSchema)
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await api.post("/user/register", data)
      toast.success(response.data?.message)
      router.replace("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data' className='space-y-5 max-w-2xl mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput<Inputs> type='text' label='Username' name='username' register={register} placeholder='Enter your username' required error={errors.username?.message} />
        <FormInput<Inputs> type='text' label='Full Name' name='fullName' register={register} placeholder='Enter your full name' required error={errors.fullName?.message} />

        {/* Avatar upload */}
        <ImageUploadWithPreview<Inputs>
          label="Avatar"
          name={"avatar" as any}
          register={register}
          watch={watch}
          accept="image/*"
          required={true}
          small={true}
          buttonText="Choose Avatar"
          error={(errors as any).avatar?.message}
        />

        {/* Video upload */}
        <ImageUploadWithPreview<Inputs>
          label="Cover Image"
          name={"coverImage" as any}
          register={register}
          watch={watch}
          accept="image/*"
          required={true}
          small={true}
          buttonText="Choose Cover Image"
          error={(errors as any).coverImage?.message}
        />
      </div>

      <div className='space-y-4'>
        <FormInput<Inputs> type='email' label='Email' name='email' register={register} placeholder='Enter your email' required error={errors.email?.message} />
        <FormInput<Inputs> type='password' label='Password' name='password' register={register} placeholder='Enter your password' required error={errors.password?.message} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex justify-center items-center gap-2 ${isSubmitting
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95"
          }`}
      >
        {isSubmitting ? "Registering..." : "Register"}
        {isSubmitting && <Loader2 className='animate-spin h-4 w-4' />}
      </button>
    </form>
  )
}

export default RegisterForm