import { cn } from '@/lib/utils';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../ui/carousel';
import Image from 'next/image';

export default function CarCarousel({
    images,
    compact,
}: Readonly<{ images: string[]; compact?: boolean }>) {
    return (
        <Carousel
            className={
                compact ? 'max-h-[350px] lg:col-span-1' : 'lg:col-span-2'
            }
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <Image
                            className={cn(
                                'object-cover rounded-lg h-full',
                                compact ? 'max-h-[350px]' : 'max-h-[450px]'
                            )}
                            src={image}
                            alt={`Car Image ${index}`}
                            width={1000}
                            height={600}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex mx-16 opacity-75" />
            <CarouselNext className="hidden md:flex mx-16 opacity-75" />
        </Carousel>
    );
}
