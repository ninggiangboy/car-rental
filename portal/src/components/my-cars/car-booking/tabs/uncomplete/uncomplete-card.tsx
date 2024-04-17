'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { BookingListRecord, BookingStatus } from '@/lib/defines';
import { cn, getDateFormatted } from '@/lib/utils';
import {
    CalendarIcon,
    CheckIcon,
    CounterClockwiseClockIcon,
} from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import HoverUserProfile from '../pending-request/hover-user-profile';
import HoverDetailRental from '../hover-detail-rental';
import HoverTotalPrice from './hover-total-price';
import CancelModal from './cancel/cancel-modal';
import Pickup from './pickup/pickup-modal';
import ConfirmPaymentModal from './confirm-payment/confirm-payment';
import ReturnCarModal from './return-car/return-car-modal';
import Link from 'next/link';
import StatusBadge from '../status-badge';

export default function UncompleteCard({
    booking,
}: {
    booking: BookingListRecord;
}) {
    const date = {
        from: new Date(booking.rentalStart),
        to: new Date(booking.rentalEnd),
    };

    const getAction = (status: string) => {
        switch (status.toUpperCase()) {
            case BookingStatus.IN_PROGRESS:
                return (
                    <>
                        <ReturnCarModal
                            message="Return car"
                            messageDesc="Are you sure to return car? This action cannot be undone!"
                            messageSuccess="Car return successfully"
                            messageError="Failed to return car, please try again later."
                            bookingId={booking.id}
                        />
                    </>
                );
            case BookingStatus.PENDING_DEPOSIT:
                return (
                    <>
                        <CancelModal
                            message="Cancel"
                            messageDesc="Are you sure to cancel this booking? This action cannot be undone!"
                            messageSuccess="Booking cancel successfully"
                            messageError="Failed to cancel booking, please try again later."
                            bookingId={booking.id}
                        />
                    </>
                );
            case BookingStatus.PENDING_PICKUP:
                return (
                    <>
                        <CancelModal
                            message="Cancel"
                            messageDesc="Are you sure to cancel this booking? This action cannot be undone!"
                            messageSuccess="Booking cancel successfully"
                            messageError="Failed to cancel booking, please try again later."
                            bookingId={booking.id}
                        />
                        <Pickup
                            message="Pickup"
                            messageDesc="Are you sure to lease this car?"
                            messageSuccess="Confirm successfully"
                            messageError="Failed to confirm, please try again later."
                            bookingId={booking.id}
                        />
                    </>
                );
            case BookingStatus.PENDING_CONFIRM_PAYMENT:
                return (
                    <>
                        <ConfirmPaymentModal
                            message="Confirm payment"
                            messageDesc="Are you sure to confirm payment?"
                            messageSuccess="Payment confirm successfully"
                            messageError="Failed to confirm payment, please try again later."
                            bookingId={booking.id}
                        />
                    </>
                );
            case BookingStatus.PENDING_PAYMENT:
                if (
                    booking.deposit > booking.totalPrice &&
                    booking.deposit > 0
                ) {
                    return (
                        <Link href={`/payment/${booking.id}`}>
                            <Button variant="default">Return Deposit</Button>
                        </Link>
                    );
                }
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
        <Card>
            <CardHeader className="items-start gap-4">
                <div className="flex justify-between w-full">
                    <div>
                        <StatusBadge status={booking.rentalStatus} />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <CounterClockwiseClockIcon className="mr-1 h-4 w-4 " />
                        {getDateFormatted(booking.createdAt)}
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    <div>
                        <div className="p-0 h-[1.5rem] gap-3 text-slate-500 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
                            <span>Deposit:</span>
                            <span className="text-xl font-extrabold">
                                ${booking.deposit}
                            </span>
                        </div>
                    </div>
                    <HoverTotalPrice
                        price={booking.totalPrice}
                        rentalId={booking.id}
                    />
                </div>
                <div className="flex justify-between w-full">
                    {/* Begin booking date */}
                    <div
                        className={cn(
                            'justify-start text-left font-normal cursor-default flex gap-2 items-center text-sm',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {getDateFormatted(date.from.toISOString())}{' '}
                                    - {getDateFormatted(date.to.toISOString())}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </div>
                    {/* End booking date */}
                    <Badge variant="outline">
                        {getTotalDays(
                            new Date(booking.rentalStart),
                            new Date(booking.rentalEnd)
                        )}{' '}
                        days
                    </Badge>
                </div>
                <Separator className="my-4" />
                {/* Begin user section */}
                <div className="w-full">
                    <div className="flex items-center justify-between ">
                        <HoverUserProfile user={booking.user} />
                        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                            <HoverDetailRental
                                renter={booking.renter}
                                driver={booking.driver}
                            />
                        </div>
                    </div>
                </div>
                {/* End user section */}
                <div className="flex justify-between w-full text-sm text-muted-foreground">
                    <div className="flex gap-2">
                        {getAction(booking.rentalStatus)}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
