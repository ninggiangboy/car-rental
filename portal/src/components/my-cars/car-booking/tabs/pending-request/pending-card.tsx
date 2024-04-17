import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CalendarIcon,
    CounterClockwiseClockIcon,
    StarFilledIcon,
    StarIcon,
} from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn, getDateFormatted } from '@/lib/utils';
import { BookingListRecord, BookingStatus } from '@/lib/defines';
import HoverUserProfile from './hover-user-profile';
import HoverDetailRental from '../hover-detail-rental';
import RejectModal from './reject/reject-modal';
import ConfirmModal from './confirm/confirm-modal';
import StatusBadge from '../status-badge';

export default function PendingCard({
    booking,
    bookingList,
    checked,
    disabled,
}: {
    booking: BookingListRecord;
    bookingList: BookingListRecord[];
    checked: boolean;
    disabled: boolean;
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
        <Card
            className={cn(
                'transition-all duration-300 ease-in-out cursor-pointer',
                !disabled && !checked && 'hover:shadow-lg',
                checked && 'border-green-600',
                disabled && 'brightness-90 cursor-not-allowed'
            )}
        >
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
                    <div>
                        <div className="p-0 h-[1.5rem] gap-3 text-slate-500 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
                            <span>Total price:</span>
                            <span className="text-xl font-extrabold">
                                ${booking.totalPrice}
                            </span>
                        </div>
                    </div>
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
                    <div className="flex gap-2">
                        <RejectModal
                            message="Reject"
                            messageDesc="Are you sure to reject this booking? This action cannot be undone!"
                            messageSuccess="Booking reject successfully"
                            messageError="Failed to reject booking, please try again later."
                            bookingId={booking.id}
                        />

                        <ConfirmModal
                            message="Confirm"
                            messageDesc="Are you sure to confirm this booking? This action cannot be undone!"
                            messageSuccess="Booking confirm successfully"
                            messageError="Failed to confirm booking, please try again later."
                            bookingId={booking.id}
                            bookingList={bookingList}
                        />
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
