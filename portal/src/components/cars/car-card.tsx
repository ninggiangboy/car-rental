'use client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { Car, SearchParams } from '@/lib/defines';
import CarCarousel from './car-carousel';
import { Button } from '../ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import DetailsLink from './details-link';
import { useSearchParams } from 'next/navigation';

export default function CarCard({ car }: Readonly<{ car: Car }>) {
    const search = useSearchParams();
    const checkin = search.get(SearchParams.CHECKIN);
    const checkout = search.get(SearchParams.CHECKOUT);
    return (
        <Card className="p-4">
            <CardHeader className="p-3 py-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardTitle className="text-md line-clamp-1">
                                {car.carName}
                            </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{car.carName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-xs text-neutral-500 line-clamp-1">
                                {car.location}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{car.location}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="p-1">
                <div className="flex items-center justify-center">
                    <CarCarousel images={car.images} />
                </div>
                <div className="mx-auto mt-4 flex max-w-[220px] items-center justify-between gap-x-1.5">
                    <p className="text-xs text-neutral-600">
                        {car.transmissionType}
                    </p>
                    <Separator
                        orientation="vertical"
                        decorative
                        className="h-4"
                    />
                    <p className="text-xs text-neutral-600">
                        <span className="leading-none">{car.fuelType}</span>
                    </p>
                    <Separator
                        orientation="vertical"
                        decorative
                        className="h-4"
                    />
                    <p className="text-xs text-neutral-600">
                        <span className="leading-none">
                            {car.numberOfSeats}
                        </span>{' '}
                        SEATS
                    </p>
                </div>
                <div className="flex gap-2 p-3 items-center justify-between">
                    <p className="flex gap-2 items-center">
                        <span className="text-2xl text-primary font-bold md:font-black">
                            {`$${car.basePrice}`}
                        </span>
                        <span className="text-md font-bold text-neutral-600">
                            / day
                        </span>
                    </p>
                    <span className="text-sm font-medium leading-none text-neutral-600 text-right flex">
                        <Icons.Star className="h-[14px] w-[14px] self-center" />{' '}
                        {car.rating}{' '}
                        {car.numberOfRides > 0 && `(${car.numberOfRides})`}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-0">
                <Button>
                    <DetailsLink id={car.id} />
                </Button>

                <Button variant="outline" asChild>
                    <Link
                        href={`/reservation?car=${car.id}&checkin=${checkin}&checkout=${checkout}`}
                        className="w-full"
                    >
                        Book now
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
