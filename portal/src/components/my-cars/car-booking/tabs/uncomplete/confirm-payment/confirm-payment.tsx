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
import { useState } from 'react';
import { Sonner } from './sonner';

export default function ConfirmPaymentModal({
    message,
    messageDesc,
    messageSuccess,
    messageError,
    bookingId,
}: Readonly<{
    message: string;
    messageDesc: string;
    messageSuccess: string;
    messageError: string;
    bookingId: number;
}>) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer" asChild>
                <Button variant="outline">{message}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <div>
                        <div className="text-sm">{messageDesc}</div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                                id="terms"
                                onCheckedChange={e =>
                                    setIsConfirmed(
                                        typeof e === 'boolean' ? e : false
                                    )
                                }
                            />
                            <label htmlFor="terms" className="text-sm">
                                I want to confirm payment
                            </label>
                        </div>
                    </div>
                </AlertDialogHeader>
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
