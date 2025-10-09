import { UseFormRegister, Path, FieldValues } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
    name: Path<T>;           // Only allow keys from the form type T
    type?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    register: UseFormRegister<T>; // Register is typed for the same T
}

const FormInput = <T extends FieldValues>({ name, type = "text", label = "", placeholder = "", required = false, register }: FormInputProps<T>) => (
    <div className="w-full flex flex-col gap-1 items-start ">
        <label htmlFor={name} className="font-medium text-[16px] text-[#1E1E1E]">{label}{required && "*"}</label>
        <div className="w-full h-[35px] border-[1px] rounded-[10px] flex items-center px-3">
            <input id={name} type={type} placeholder={placeholder} {...register(name)} className="outline-none h-[21px] w-full text-[14px]" />
        </div>
    </div>
);

export default FormInput;
