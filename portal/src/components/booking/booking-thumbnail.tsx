'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import CarCarousel from '../cars/car-carousel';
import { Button } from '@/components/ui/button';
import { Booking, BookingStatus } from '@/lib/defines';
import { getDateFormatted } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Cross1Icon,
    CrossCircledIcon,
    DotsHorizontalIcon,
    PaperPlaneIcon,
    Pencil2Icon,
    PlusCircledIcon,
} from '@radix-ui/react-icons';

import { Badge } from '../ui/badge';
import { Separator } from '@/components/ui/separator';
import BookingAlertModal from './booking-alert-modal';
import Link from 'next/link';
import RatingModal from './rating-modal';
import ViewRatingModal from './view-rating-modal';
import { useState } from 'react';
import BookingPopover from './booking-popover';

export default function BookingThumbnail({
    booking,
}: Readonly<{ booking: Booking }>) {
    const getBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case BookingStatus.PENDING:
                return (
                    <Badge variant="pending">
                        Wating for carowner confirm booking
                    </Badge>
                );
            case BookingStatus.REJECTED:
                return <Badge variant="reject">Rejected</Badge>;
            case BookingStatus.CANCELLED:
                return <Badge variant="cancel">Cancelled</Badge>;
            case BookingStatus.IN_PROGRESS:
                return <Badge variant="inprogress">In progress</Badge>;
            case BookingStatus.COMPLETED:
                return <Badge variant="complete">Successfully finished</Badge>;
            case BookingStatus.PENDING_DEPOSIT:
                return (
                    <Badge variant="pending">Waiting for paying deposit</Badge>
                );
            case BookingStatus.PENDING_PICKUP:
                return <Badge variant="pending">Waiting for picking up</Badge>;
            case BookingStatus.PENDING_PAYMENT:
                return <Badge variant="pending">Waiting for payment</Badge>;
            case BookingStatus.PENDING_CONFIRM_PAYMENT:
                return (
                    <Badge variant="pending">
                        Waiting for carowner confirm payment
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {status.replaceAll('_', ' ')}
                    </Badge>
                );
        }
    };

    const getAction = (status: string) => {
        switch (status.toUpperCase()) {
            case BookingStatus.REJECTED:
                return (
                    <Link href={`/reservation?car=${booking.carId}`}>
                        <Button variant="outline">
                            <PaperPlaneIcon className="w-5 h-5 mr-2" />
                            <div>Rent again</div>
                        </Button>
                    </Link>
                );
            case BookingStatus.CANCELLED:
                return (
                    <Link href={`/reservation?car=${booking.carId}`}>
                        <Button variant="outline">
                            <PaperPlaneIcon className="mr-2" />
                            <div>Rent again</div>
                        </Button>
                    </Link>
                );
            case BookingStatus.COMPLETED:
                return (
                    <>
                        {!booking.rate ? (
                            <RatingModal rentalId={booking.id} />
                        ) : (
                            <ViewRatingModal
                                rating={booking.rate}
                                comment={booking.comment}
                                createdAt={booking.ratingTime}
                            />
                        )}
                    </>
                );
            case BookingStatus.PENDING_DEPOSIT:
                return (
                    <Link href={`/payment/${booking.id}`}>
                        <Button variant="outline">
                            <PaperPlaneIcon className="mr-2" />
                            <div>Pay deposit</div>
                        </Button>
                    </Link>
                );
            case BookingStatus.PENDING_PAYMENT:
                return (
                    <>
                        {booking.deposit < booking.totalPrice && (
                            <Link href={`/payment/${booking.id}`}>
                                <Button variant="outline">
                                    <PaperPlaneIcon className="mr-2" />
                                    <div>Pay rent fee</div>
                                </Button>
                            </Link>
                        )}
                    </>
                );
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

    return (
        <div className="md:relative">
            <Card className="p-5 md:px-8 md:py-8 xl:px-16 xl:py-8 my-5 gap-2">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 md:gap-10">
                    <CarCarousel compact images={booking.images} />
                    <div className="">
                        <CardHeader className="gird gap-2 p-0 ">
                            <CardTitle className="text-xl md:text-2xl max-md:text-center max-md:py-5">
                                <Link
                                    href={`/reservation/${booking.id}`}
                                    className="text-3xl font-bold text-neutral-600"
                                >
                                    {booking.carName}
                                </Link>
                            </CardTitle>
                            <div className="flex flex-col gap-1">
                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium text-neutral-600">
                                        Status
                                    </span>
                                    <div className="col-span-1 ">
                                        {getBadge(booking.rentalStatus)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium  text-neutral-600 ">
                                        Pick up / Drop off
                                    </span>
                                    <span className="text-neutral-600 text-sm col-span-1 ">
                                        {`${getDateFormatted(booking.rentalStart)} - ${getDateFormatted(booking.rentalEnd)}`}
                                    </span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col gap-1">
                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium text-neutral-600">
                                        Base Price
                                    </span>
                                    <div className="col-span-1 text-sm text-neutral-600 font-medium">
                                        $
                                        {Math.ceil(
                                            booking.totalPrice /
                                                getTotalDays(
                                                    new Date(
                                                        booking.rentalStart
                                                    ),
                                                    new Date(booking.rentalEnd)
                                                )
                                        )}{' '}
                                        / day
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium  text-neutral-600 ">
                                        Number of days
                                    </span>
                                    <span className="col-span-1 text-sm text-neutral-600 font-medium">
                                        {getTotalDays(
                                            new Date(booking.rentalStart),
                                            new Date(booking.rentalEnd)
                                        )}{' '}
                                        day(s)
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium text-neutral-600">
                                        Total Price
                                    </span>
                                    <div className="col-span-1 text-sm text-neutral-600 font-medium">
                                        ${booking.totalPrice}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4 " />
                            {booking.rentalStatus !==
                                BookingStatus.COMPLETED && (
                                <div className="grid grid-cols-2 ">
                                    <span className="text-sm font-medium text-neutral-600">
                                        Deposit
                                    </span>
                                    <div className="col-span-1 text-sm text-neutral-600 font-medium">
                                        {booking.deposit
                                            ? `$${booking.deposit}`
                                            : 'No deposit required'}
                                    </div>
                                </div>
                            )}
                            <div>{getAction(booking.rentalStatus)}</div>
                        </CardHeader>

                        <BookingPopover booking={booking} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
