import { cn } from '@/utils/cn';

interface WatchHistoryCardSkeletonProps {
    className?: string;
}

const WatchHistoryCardSkeleton = ({ className }: WatchHistoryCardSkeletonProps) => {
    return (
        <div className={cn("flex gap-4 p-3 rounded-xl animate-pulse", className)}>
            {/* Thumbnail skeleton */}
            <div className="relative w-40 sm:w-56 md:w-64 shrink-0 aspect-video rounded-lg bg-gray-200 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent "
                    style={{ backgroundSize: '200% 100%' }}
                />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-1 space-y-3">
                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-5 rounded w-full max-w-md bg-zinc-200 " />
                    <div className="h-5 rounded w-3/4 max-w-sm bg-zinc-200 " />
                </div>

                {/* Channel info skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-200 " />
                    <div className="h-4 rounded w-24 bg-zinc-200 " />
                </div>

                {/* Views skeleton */}
                <div className="h-4 rounded w-20 bg-zinc-200 " />
            </div>

            {/* Options skeleton */}
            <div className="shrink-0 self-start pt-1">
                <div className="h-8 w-8 rounded-full bg-zinc-200" />
            </div>
        </div>
    );
};

export default WatchHistoryCardSkeleton;
