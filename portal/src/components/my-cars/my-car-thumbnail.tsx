import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Car } from '@/lib/defines';
//   import CarCarousel from "./car-carousel";
import CarCarousel from '../cars/car-carousel';
import { Badge } from '@/components/ui/badge';
import DetailsLink from '@/components/cars/details-link';
import { SelectStatus } from './select';
import Link from 'next/link';

export default async function CarThumbnail({ car }: Readonly<{ car: Car }>) {
    return (
        <Card className="p-5 md:px-8 md:py-5 xl:px-16 xl:py-8 grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 my-5 gap-2 md:gap-10">
            <CarCarousel images={car.images} />
            <div>
                <CardHeader className="gird gap-2">
                    <CardTitle className="text-xl md:text-2xl line-clamp-2">
                        <Link href={`/my-cars/${car.id}`}>{car.carName}</Link>
                    </CardTitle>
                    <CardDescription className="flex gap-2">
                        <Icons.Star className="h-[14px] w-[14px] self-center" />
                        <span className="text-sm font-medium leading-none text-neutral-600">
                            {`${car.rating} (${car.numberOfRides} rides)`}
                        </span>
                    </CardDescription>
                    <CardDescription>
                        <span className="text-neutral-600">{car.location}</span>
                    </CardDescription>
                    <CardDescription className="flex gap-2 items-end">
                        <span className="md:text-5xl text-3xl text-primary font-bold md:font-black">
                            {`$${car.basePrice}`}
                        </span>
                        <span className="md:text-2xl text-xl font-bold text-neutral-600">
                            / day
                        </span>
                    </CardDescription>
                    <div className="mt-8 text-sm flex max-w-[300px] items-center gap-x-1.5 gap-1">
                        <Badge variant="secondary">
                            {car.fuelType.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary">
                            {car.transmissionType.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary">{`${car.numberOfSeats} seats`}</Badge>
                    </div>
                    <div className="mt-8 text-sm flex max-w-[300px] items-center gap-x-1.5">
                        {car.fuelConsumption > 0 && (
                            <Badge variant="secondary">
                                {car.fuelConsumption > 0 &&
                                    `${car.fuelConsumption} L/100km`}
                            </Badge>
                        )}
                        <Badge variant="secondary">{`${car.mileage || 0} km mileage`}</Badge>
                    </div>
                    <SelectStatus status={car.status} carId={car.id} />
                </CardHeader>

                {/* <CardContent className="grid grid-cols-2 gap-2 sm:flex-row">
          <Button>
            <DetailsLink id={car.id} />
          </Button>
          <Button variant="outline">Bookmark</Button>
        </CardContent> */}
                {/* Select --> Show Dialog */}
                {/* <CardContent className="grid grid-cols-2 gap-2 sm:flex-row"> */}
                {/* <Badge className="font-bold p-1.5 text-md text-black max-w-40 bg-lime-400">
            {car.status}
          </Badge> */}
                {/* <span className="md:text-3xl text-xl text-lime-500 font-bold md:font-green">
          {car.status}
        </span> */}
                {/* <Button variant="outline">Change status</Button>
        </CardContent> */}
            </div>
        </Card>
    );
}
