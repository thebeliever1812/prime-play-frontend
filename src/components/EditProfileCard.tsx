interface EditProfileCardProps {
    title: string;
    description: string;
    variant?: "default" | "danger";
    onClick?: () => void;
};

export default function EditProfileCard({
    title,
    description,
    variant = "default",
    onClick,
}: EditProfileCardProps) {
    const isDanger = variant === "danger";

    return (
        <button
            onClick={onClick}
            className={`p-4 bg-white border rounded-lg transition-colors text-left font-medium hover:shadow-sm cursor-pointer
        ${isDanger
                    ? "border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                }`}
        >
            <span className="block text-sm font-semibold">{title}</span>
            <span
                className={`text-xs mt-1 block ${isDanger ? "text-red-500" : "text-gray-500"
                    }`}
            >
                {description}
            </span>
        </button>
    );
}
