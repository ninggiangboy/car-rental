'use client';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import CarCarouselLoading from '@/components/booking/booking-loading/car-carousel-loading';
import { Skeleton } from '@/components/ui/skeleton';
import CarDetailCarouselLoading from './car-detail-carousel-loading';

export default function CarHeaderInforLoading() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 md:gap-10">
            <CarDetailCarouselLoading />
            <div>
                <CardHeader className="gird gap-2 pt-0">
                    <CardTitle className="text-xl md:text-2xl text-center max-md:py-5">
                        <Skeleton className="h-[2rem] w-[20rem] rounded-full" />
                    </CardTitle>
                    <div className="flex justify-center">
                        <Skeleton className="h-[5rem] w-[15rem] rounded-sm" />
                    </div>

                    <hr />
                    <div className="py-2">
                        <Skeleton className="h-[1.25rem] w-[15rem] rounded-full" />
                    </div>
                    <div className="py-2">
                        <Skeleton className="h-[1.25rem] w-[15rem] rounded-full" />
                    </div>
                    <div className="py-2">
                        <Skeleton className="h-[1.25rem] w-[15rem] rounded-full" />
                    </div>
                    <hr />
                </CardHeader>

                <CardContent className="flex flex-col md:flex-row justify-around">
                    <div className="py-3">
                        <Skeleton className="h-[2.5rem] w-[6rem] rounded-sm" />
                    </div>
                    <div className="py-3">
                        <Skeleton className="h-[2.5rem] w-[6rem] rounded-sm" />
                    </div>
                </CardContent>
            </div>
        </div>
    );
}
