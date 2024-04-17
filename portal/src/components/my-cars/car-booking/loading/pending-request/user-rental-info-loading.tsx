import { Skeleton } from '@/components/ui/skeleton';

export default function UserRentalInfoLoading() {
    return (
        <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2 ">
                <span className="font-semibold">
                    <Skeleton className="h-4 w-[100px]" />
                </span>
                <span className="mx-auto">
                    {' '}
                    <Skeleton className="h-4 w-[80px]" />
                </span>
            </div>
            <div className="flex flex-col gap-2 text-center">
                <span className="font-semibold">
                    {' '}
                    <Skeleton className="h-4 w-[100px]" />
                </span>
                <span className="mx-auto">
                    {' '}
                    <Skeleton className="h-4 w-[50px]" />
                </span>
            </div>
            <div className="flex flex-col gap-2 text-center">
                <span className="font-semibold">
                    {' '}
                    <Skeleton className="h-4 w-[100px]" />
                </span>
                <span className="mx-auto">
                    {' '}
                    <Skeleton className="h-4 w-[120px]" />
                </span>
            </div>
        </div>
    );
}
