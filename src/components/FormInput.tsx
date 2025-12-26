import { UseFormRegister, Path, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
    name: Path<T>;           // Only allow keys from the form type T
    type?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    register: UseFormRegister<T>; // Register is typed for the same T
    error?: string;
}

const FormInput = <T extends FieldValues>({ name, type = "text", label = "", placeholder = "", required = false, register, error }: FormInputProps<T>) => (
    <div className="flex w-full flex-col gap-2">
        <label htmlFor={name} className="text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

export default FormInput;
