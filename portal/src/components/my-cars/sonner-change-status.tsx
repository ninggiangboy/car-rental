'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cancelBooking, changeStatus } from '@/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { useEffect } from 'react';

export function SonnerChangeStatus({
    isConfirmed,
    carId,
    status,
}: Readonly<{
    isConfirmed: boolean;
    carId: number;
    status: string;
}>) {
    const { push } = useRouter();
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const handleClicked = () => {
        changeStatus(carId, status).then(isSucceed => {
            if (isSucceed) {
                push(createUrl(pathName, searchParams));
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }
        });
    };

    return (
        <Button
            variant="default"
            disabled={!isConfirmed}
            onClick={handleClicked}
        >
            Confirm
        </Button>
    );
}
