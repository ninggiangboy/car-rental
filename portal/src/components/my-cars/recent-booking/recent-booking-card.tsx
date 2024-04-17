'use client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookingStatus, RecentRent } from '@/lib/defines';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, getDateFormatted } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '../car-booking/tabs/status-badge';
import { formatDistanceToNow, format } from 'date-fns';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function RecentBookingCard({
    booking,
}: Readonly<{ booking: RecentRent }>) {
    const baseUrl = `/my-cars/${booking.carId}?tab=`;

    const getUrl = (status: string) => {
        switch (status) {
            case BookingStatus.PENDING:
                return `${baseUrl}pending`;
            case BookingStatus.REJECTED:
            case BookingStatus.CANCELLED:
            case BookingStatus.COMPLETED:
                return `${baseUrl}report`;
            default:
                return `${baseUrl}uncomplete`;
        }
    };

    return (
        <Link href={getUrl(booking.status)}>
            <Card className="p-4 relative">
                <CardHeader className="p-3 py-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CardTitle className="text-md line-clamp-1 text-left">
                                    {booking?.carName}
                                </CardTitle>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{booking?.carName}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardHeader>
                {booking.numberOfPending === 0 ||
                booking.numberOfPending === 1 ? (
                    <div className="text-sm text-center">
                        {`${getDateFormatted(booking.startDate)} - ${getDateFormatted(booking.endDate)}`}
                    </div>
                ) : (
                    <div className="h-[1.25rem]"> </div>
                )}

                <CardContent className="p-1 relative">
                    {booking?.status === BookingStatus.PENDING &&
                        booking.numberOfPending > 1 && (
                            <Badge
                                variant="pending"
                                className="absolute top-3 right-3"
                            >
                                {booking.numberOfPending}
                            </Badge>
                        )}

                    <div className="flex items-center justify-center">
                        <Image
                            className={cn('object-cover rounded-lg h-full')}
                            src={booking.carImage}
                            alt="Car Image"
                            width={1000}
                            height={600}
                        />
                    </div>
                    {booking?.status === BookingStatus.PENDING ? (
                        <div className="flex justify-between my-2">
                            <StatusBadge status={booking.status} />
                        </div>
                    ) : (
                        <div className="flex justify-start my-2">
                            <StatusBadge status={booking.status} />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end p-0 ">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="text-sm text-slate-400 flex items-center">
                                    <CounterClockwiseClockIcon className="w-4 h-4 mr-2" />
                                    {formatDistanceToNow(
                                        new Date(booking.lastModified),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {format(
                                        new Date(booking.lastModified),
                                        'HH:mm PPP'
                                    )}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
            </Card>
        </Link>
    );
}
