'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cancelBooking } from '@/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { useEffect } from 'react';

export function SonnerBooking({
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
    const { push } = useRouter();
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const handleClicked = () => {
        cancelBooking(bookingId).then(isSucceed => {
            if (isSucceed) {
                push(createUrl(pathName, searchParams));
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
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
