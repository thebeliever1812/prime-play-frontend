const VideoCardSkeleton = () => {
    return (
        <div className="w-full max-w-sm animate-pulse">
            {/* Thumbnail */}
            <div className="w-full aspect-video bg-gray-200 rounded-lg" />

            {/* Meta */}
            <div className="flex gap-3 mt-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-200 rounded-full" />

                <div className="flex-1 space-y-2">
                    {/* Title */}
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    {/* Subtitle */}
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
};

export default VideoCardSkeleton;
