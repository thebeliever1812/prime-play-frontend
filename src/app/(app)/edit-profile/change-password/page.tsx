'use client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { updatePasswordSchema } from '@/schemas/updatePasswordSchema';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/utils/api';
import axios from 'axios';

type PasswordFormInputs = z.infer<typeof updatePasswordSchema>;

export default function ChangePasswordPage() {
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<PasswordFormInputs>({
        mode: 'onBlur',
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        setIsLoading(true);
        try {
            // API call here
            const response = await api.patch('/user/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password. Try again.' });
            } else {
                setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Change Password</h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    Update your password to keep your account secure
                </p>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Old Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.old ? 'text' : 'password'}
                                {...register('oldPassword', { required: true })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('old')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                {...register('newPassword', {
                                    required: true
                                })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                {...register('confirmPassword', {
                                    required: true
                                })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition duration-200 mt-8"
                    >
                        {isLoading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Your password will be encrypted and securely stored.
                </p>
            </div>
        </div>
    );
}