"use client"
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Image from 'next/image'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { coverImageValidation } from '@/schemas/userRegister.schema'
import { api } from '@/utils/api'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const coverImageSchema = z.object({
    newCoverImage: coverImageValidation
})

type Inputs = z.infer<typeof coverImageSchema>

export const ChangeCoverImageForm = () => {
    const [preview, setPreview] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter()

    const { register, handleSubmit, watch } = useForm<Inputs>({
        resolver: zodResolver(coverImageSchema)
    })

    const fileWatch = watch('newCoverImage')

    useEffect(() => {
        if (fileWatch?.[0]) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result as string)
            reader.readAsDataURL(fileWatch[0])
        }
    }, [fileWatch])

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('newCoverImage', data.newCoverImage[0])

            const response = await api.patch('/user/update-cover-image', formData)
            toast.success(response.data?.data?.message || 'Cover image updated successfully')
            router.replace("/edit-profile")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error uploading cover image:', error.response?.data?.message || error.message)
                toast.error(error.response?.data?.message || 'Failed to update cover image')
            } else {
                console.log('Unexpected error while updating cover image:', error)
                toast.error('Unexpected error occurred while updating cover image')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto py-3 sm:p-6">
            <div className="bg-gradient-to-br from-black to-[#4F46E5] rounded-lg p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-2">Update Cover Image</h2>
                <p className="text-blue-100 mb-8">Choose an attractive image to showcase your profile</p>

                <div className="relative mb-6">
                    {preview ? (
                        <Image src={preview} alt="Preview" width={400} height={200} className="w-full rounded-lg object-cover" />
                    ) : (
                        <div className="w-full h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center border-2 border-dashed border-white">
                            <span className="text-white text-center">No image selected</span>
                        </div>
                    )}
                </div>

                <div className="block mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        {...register('newCoverImage', { required: true })}
                        className="hidden"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg cursor-pointer text-center hover:bg-opacity-90 transition">
                        📸 Choose Cover Image
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !fileWatch?.[0]}
                    className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition"
                >
                    {isLoading ? 'Uploading...' : 'Update Cover Image'}
                </button>
            </div>
        </form>
    )
}

export default ChangeCoverImageForm