'use client';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SonnerBooking } from './sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    CounterClockwiseClockIcon,
    CrossCircledIcon,
    FaceIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

export default function BookingAlertModal({
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
                {/* <Button variant="outline">
          <CrossCircledIcon className="w-5 h-5 mr-2 text-red-500" />
          {message}
        </Button> */}
                <div className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div>{message}</div>
                    <div>
                        <CrossCircledIcon className="w-5 h-5 mr-2 text-red-500" />
                    </div>
                </div>
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
                                I agree to the terms and conditions
                            </label>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <SonnerBooking
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
