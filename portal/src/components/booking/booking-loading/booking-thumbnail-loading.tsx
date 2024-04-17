'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import CarCarouselLoading from './car-carousel-loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default function BookingThumbnailLoading() {
    return (
        <div className="md:relative">
            <Card className="p-5 md:px-8 md:py-8 xl:px-16 xl:py-8 my-5 gap-2">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 md:gap-10">
                    <CarCarouselLoading />
                    <div className="">
                        <CardHeader className="gird gap-2 p-0 ">
                            <CardTitle className="text-xl md:text-2xl max-md:text-center max-md:py-5">
                                <Skeleton className="h-[2rem] w-[10rem] rounded-full" />
                            </CardTitle>

                            <div className="py-3">
                                <Skeleton className="h-[1.25rem] w-[30rem] rounded-full" />
                            </div>
                            <div className="py-3">
                                <Skeleton className="h-[1.25rem] w-[30rem] rounded-full" />
                            </div>
                            <div className="py-3">
                                <Skeleton className="h-[1.25rem] w-[30rem] rounded-full" />
                            </div>
                            <div className="py-3">
                                <Skeleton className="h-[1.25rem] w-[30rem] rounded-full" />
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 md:grid-cols-3">
                                    <span className="text-sm font-medium text-neutral-600">
                                    <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <div className="col-span-1 md:col-span-2">
                                    <Skeleton className="w-12 rounded-full" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3">
                                    <span className="text-sm font-medium  text-neutral-600 ">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <span className="text-neutral-600 text-sm col-span-1 md:col-span-2">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                </div>
                            </div> */}
                            <Separator className="my-4" />
                            {/* <div className="flex justify-between md:justify-start md:gap-16">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-neutral-600">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <span className="text-sm font-medium text-neutral-600">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <hr />
                                    <span className="text-sm font-medium text-neutral-600">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm text-neutral-600 font-medium">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <span className="text-sm text-neutral-600 font-medium">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                    <hr />
                                    <span className="text-sm text-neutral-600 font-medium">
                                        <Skeleton className="w-12 rounded-full" />
                                    </span>
                                </div>
                            </div> */}
                            <Separator className="my-4" />
                            {/* <div className="flex justify-between md:justify-start md:gap-[7.5rem]">
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="w-12 rounded-full" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="w-12 rounded-full" />
                                </div>
                            </div> */}
                        </CardHeader>
                    </div>
                </div>
            </Card>
        </div>
    );
}
