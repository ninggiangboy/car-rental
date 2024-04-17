import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default function CarInforLoading() {
    return (
        <Card className="p-5 md:px-8 md:py-5 xl:px-16 xl:py-8 my-5 gap-2">
            <div>
                <div className="flex flex-col md:flex-row gap-3 justify-between mb-6">
                    <div className="flex justify-center md:justify-start gap-2">
                        <div className="flex flex-col justify-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-20 rounded-sm" />
                            <Skeleton className="h-4 w-20 rounded-sm" />
                        </div>
                    </div>
                    <div className="flex justify-center md:justify-start gap-2">
                        <div className="flex flex-col justify-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-20 rounded-sm" />
                            <Skeleton className="h-4 w-20 rounded-sm" />
                        </div>
                    </div>
                    <div className="flex justify-center md:justify-start gap-2">
                        <div className="flex flex-col justify-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-20 rounded-sm" />
                            <Skeleton className="h-4 w-20 rounded-sm" />
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="col-span-2 flex flex-col gap-3">
                        <Skeleton className="h-[1.25rem] w-20 rounded-sm" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-[1.25rem] max-w-[40rem] rounded-sm" />
                            <Skeleton className="h-[1.25rem] max-w-[40rem] rounded-sm" />
                            <Skeleton className="h-[1.25rem] max-w-[40rem] rounded-sm" />
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-center">
                        <div className="flex justify-center">
                            <Skeleton className="h-14 w-14 rounded-sm" />
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />
            </div>
        </Card>
    );
}
