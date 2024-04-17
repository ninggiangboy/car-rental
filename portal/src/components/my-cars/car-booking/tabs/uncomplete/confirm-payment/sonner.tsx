'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { confirmPayment, pickup, rejectBooking } from '@/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';

export function Sonner({
    isConfirmed,
    confirmMessage,
    message,
    messageSuccess,
    messageError,
    bookingId,
}: Readonly<{
    isConfirmed: boolean;
    confirmMessage: string;
    message: string;
    messageSuccess: string;
    messageError: string;
    bookingId: number;
}>) {
    const router = useRouter();
    const handleClicked = () => {
        confirmPayment(bookingId).then(isSucceed => {
            if (isSucceed) {
                toast.success(messageSuccess);
                router.refresh();
            } else {
                toast.error(message, {
                    description: messageError,
                });
            }
        });
    };

    return (
        <Button
            variant="default"
            onClick={handleClicked}
            disabled={!isConfirmed}
        >
            {confirmMessage}
        </Button>
    );
}
