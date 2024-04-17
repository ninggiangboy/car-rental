'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { BookingStatus } from '@/lib/defines';
import { cn, getDateFormatted } from '@/lib/utils';
import { CalendarIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@radix-ui/react-separator';
import { Button } from '@/components/ui/button';

import { BookingListRecord } from '@/lib/defines';
import HoverUserProfile from '../hover-user-profile';
import HoverDetailRental from '../../hover-detail-rental';

export default function RejectCard({
    booking,
}: {
    booking: BookingListRecord;
}) {
    const date = {
        from: new Date(booking.rentalStart),
        to: new Date(booking.rentalEnd),
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
                <Separator />
                {/* Begin user section */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-5">
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
                    {/* <Button variant="destructive">Reject</Button> */}
                    <div>
                        <div className="p-0 h-[1.5rem] gap-3 text-slate-500 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
                            <span>Total price:</span>
                            <span className="text-xl font-extrabold ">
                                ${booking.totalPrice}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <CounterClockwiseClockIcon className="mr-1 h-4 w-4" />

                        {getDateFormatted(booking.createdAt)}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
