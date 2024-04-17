import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

const ViewCarImages = ({ images }: { images: string[] }) => {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div>
                            <Image
                                className="object-cover rounded-lg h-full"
                                src={image}
                                alt={`Car Image ${index}`}
                                width={1000}
                                height={600}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default ViewCarImages;
