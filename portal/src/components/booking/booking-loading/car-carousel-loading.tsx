'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export default function CarCarouselLoading() {
    return (
        <Carousel className="max-h-[300px] lg:col-span-1">
            <CarouselContent>
                <CarouselItem>
                    <div className="max-h-[300px] rounded-sm">
                        <Skeleton className="w-[600px] h-[300px]" />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
