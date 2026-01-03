"use client"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegister, Path, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
    name: Path<T>;
    type?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    register: UseFormRegister<T>;
    error?: string;
}

const FormInput = <T extends FieldValues>({
    name,
    type = "text",
    label = "",
    placeholder = "",
    required = false,
    register,
    error,
}: FormInputProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-900">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type={type === "password" && !showPassword ? "password" : "text"}
                    placeholder={placeholder}
                    {...register(name)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"}`}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-[10px] text-sm cursor-pointer"
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;
