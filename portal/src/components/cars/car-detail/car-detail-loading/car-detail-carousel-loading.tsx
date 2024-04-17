import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export default function CarDetailCarouselLoading() {
    return (
        <Carousel className="lg:col-span-2">
            <CarouselContent>
                <CarouselItem>
                    <div className="max-h-[400px] rounded-sm">
                        <Skeleton className="w-[1000px] h-[600px]" />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
