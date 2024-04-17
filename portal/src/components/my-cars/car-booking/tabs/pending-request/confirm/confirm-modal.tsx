'use client';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { BookingListRecord } from '@/lib/defines';
import { fetchRejectBookingId } from '@/lib/actions';
import { Sonner } from './sonner';
import ScrollBookingArea from './scroll-area';

export default function ConfirmModal({
    message,
    messageDesc,
    messageSuccess,
    messageError,
    bookingId,
    bookingList,
}: Readonly<{
    message: string;
    messageDesc: string;
    messageSuccess: string;
    messageError: string;
    bookingId: number;
    bookingList: BookingListRecord[];
}>) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [rejectList, setRejectList] = useState<BookingListRecord[]>([]);

    useEffect(() => {
        fetchRejectBookingId(bookingId).then(data =>
            setRejectList(
                bookingList.filter(booking => data.includes(booking.id))
            )
        );
    }, [bookingId]);

    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer" asChild>
                <Button variant="default">{message}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[600px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                    <div className="text-sm">{messageDesc}</div>
                    {rejectList.length !== 0 && (
                        <div className="mb-7">
                            <h4 className="mb-4 text-sm">
                                By confirming this request, you will reject the
                                following request(s):
                            </h4>
                            <ScrollBookingArea bookingList={rejectList} />
                        </div>
                    )}

                    <div className="flex items-center space-x-2 mt-7">
                        <Checkbox
                            id="terms"
                            onCheckedChange={e =>
                                setIsConfirmed(
                                    typeof e === 'boolean' ? e : false
                                )
                            }
                        />
                        <label htmlFor="terms" className="text-sm">
                            I want to confirm this booking
                        </label>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <Sonner
                        isConfirmed={isConfirmed}
                        confirmMessage="Continue"
                        message={message}
                        messageSuccess={messageSuccess}
                        messageError={messageError}
                        bookingId={bookingId}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
