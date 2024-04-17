import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function PendingCardLoading() {
    return (
        <div>
            <Card>
                <CardHeader className="items-start gap-4">
                    <div className="flex justify-between w-full">
                        <div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <div>
                            <Skeleton className="h-6 w-28" />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-28" />
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        {/* Begin booking date */}
                        <div className="justify-start text-left font-normal cursor-default flex gap-2 items-center text-sm">
                            <Skeleton className="h-7 w-24" />
                        </div>
                        {/* End booking date */}
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Separator />
                    {/* Begin rating section */}
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex gap-4 items-center">
                                <Skeleton className="h-[40px] w-[40px] rounded-full" />
                                <div className="flex flex-col justify-between gap-1">
                                    <p>
                                        <Skeleton className="h-4 w-20" />
                                    </p>
                                    <p>
                                        <Skeleton className="h-4 w-24" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full text-sm text-muted-foreground">
                        <Skeleton className="h-7 w-24" />
                        <div className="flex items-center">
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    {/* End rating section */}
                </CardHeader>
            </Card>
        </div>
    );
}
