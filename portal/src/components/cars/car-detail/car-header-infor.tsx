import { CarDetailInfo, ROLE } from '@/lib/defines';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarCarousel from '../car-carousel';
import { Button } from '@/components/ui/button';
import { fetchAvailableDate, getUserRole } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import {
    DrawingPinIcon,
    PersonIcon,
    QuestionMarkCircledIcon,
    RocketIcon,
    SewingPinFilledIcon,
    SewingPinIcon,
} from '@radix-ui/react-icons';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import SelectTime from './select-time';
import ButtonShare from './button-share';

import ViewCarImages from './view-car-images';

export default async function CarHeaderInfor({
    car,
    checkin,
    checkout,
}: Readonly<{
    car: CarDetailInfo;
    checkin: Date;
    checkout: Date;
}>) {
    const dates = await fetchAvailableDate(car.id);
    const getBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'unavailable':
                return <Badge variant="cancel">{status}</Badge>;
            case 'available':
                return <Badge variant="complete">{status}</Badge>;
            case 'booked':
                return <Badge variant="pending">{status}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTotalDays = (checkin: Date, checkout: Date): number => {
        const diffInMilliseconds = Math.abs(
            checkout.getTime() - checkin.getTime()
        );
        const diffInDays = Math.ceil(
            diffInMilliseconds / (1000 * 60 * 60 * 24)
        );
        return diffInDays;
    };

    const totalDays = getTotalDays(checkin, checkout);

    const carName = `${car.brandName} ${car.modelName} ${car.year}`;

    const userRole = await getUserRole();

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 md:gap-10">
            <Dialog>
                <DialogTrigger asChild className="cursor-pointer">
                    <CarCarousel images={car.images} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px] p-0 bg-transparent border-none">
                    <ViewCarImages images={car.images} />
                </DialogContent>
            </Dialog>
            <div className="flex flex-col justify-center">
                <CardHeader className="gird gap-2 pt-0">
                    <CardTitle className="text-xl md:text-2xl text-center max-md:py-5">
                        <span
                            className={`${carName.length < 25 ? 'text-3xl' : ''} font-bold text-neutral-600`}
                        >
                            {`${car.brandName} ${car.modelName} ${car.year}`}
                        </span>
                    </CardTitle>
                    <div className="md:flex md:gap-1">
                        <span className="text-sm text-neutral-600">
                            {car.location}
                        </span>
                    </div>

                    <SelectTime dates={dates} />
                    <hr />

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-neutral-600 flex">
                                Base Price&nbsp;
                                <div className="flex flex-col justify-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <QuestionMarkCircledIcon />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Car Rental Information
                                                </DialogTitle>
                                                <DialogDescription>
                                                    <div>
                                                        Car rental price
                                                        includes our service
                                                        fee. Service fees help
                                                        us maintain the
                                                        application & implement
                                                        thoughtful customer care
                                                        activities, to ensure
                                                        you have a safe trip &
                                                        the best experience with
                                                        our service, including:
                                                    </div>

                                                    <ul>
                                                        <li>
                                                            - Call center
                                                            service, customer
                                                            care & support for
                                                            car booking.
                                                        </li>
                                                        <li>
                                                            - Find a replacement
                                                            car / refund /
                                                            compensation if the
                                                            trip is cancelled by
                                                            the car owner.
                                                        </li>
                                                        <li>
                                                            - Find a replacement
                                                            car/refund if you
                                                            change your
                                                            itinerary.
                                                        </li>
                                                        <li>
                                                            - Support to resolve
                                                            disputes arising
                                                            with vehicle owners
                                                            (if any).
                                                        </li>
                                                        <li>
                                                            - Support working
                                                            with insurers and
                                                            partner garages when
                                                            incidents occur (if
                                                            any).
                                                        </li>
                                                        <li>
                                                            - And all other
                                                            problems that arise
                                                            during the car
                                                            rental process if
                                                            you need support
                                                            from us.
                                                        </li>
                                                    </ul>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </span>

                            <span className="text-sm font-medium text-neutral-600 flex">
                                Number of days&nbsp;
                                <div className="flex flex-col justify-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <QuestionMarkCircledIcon />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Number Of Days
                                                </DialogTitle>
                                                <DialogDescription>
                                                    <div>
                                                        Car rental prices are
                                                        calculated as a round
                                                        per day; car rental time
                                                        less than 24 hours will
                                                        be calculated as 1 full
                                                        day.
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </span>
                            <hr />

                            <span className="text-sm font-medium text-neutral-600">
                                Total Price
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm text-neutral-600 font-medium">
                                ${car.basePrice} / day
                            </span>
                            <span className="text-sm text-neutral-600 font-medium">
                                {`${totalDays} ${totalDays == 1 ? 'day' : 'days'}`}
                            </span>
                            <hr />
                            <span className="text-sm text-neutral-600 font-medium">
                                ${car.basePrice * totalDays}
                            </span>
                        </div>
                    </div>
                    <hr />
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-0">
                    {(userRole == ROLE.CUSTOMER || userRole == ROLE.GUEST) && (
                        <Button
                            variant={'default'}
                            disabled={dates.length === 0}
                        >
                            <Link
                                className="flex gap-2 items-center"
                                href={`/reservation?car=${car.id}`}
                            >
                                <RocketIcon />
                                Book Now
                            </Link>
                        </Button>
                    )}
                    <ButtonShare />
                </CardContent>
            </div>
        </div>
    );
}
