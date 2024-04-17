'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { giveRating } from '@/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';

export function SonnerRating({
    confirmMessage,
    message,
    messageSuccess,
    messageError,
    rentalId,
    rating,
    comment,
}: Readonly<{
    confirmMessage: string;
    message: string;
    messageSuccess: string;
    messageError: string;
    rentalId: number;
    rating: number;
    comment: string;
}>) {
    const { push } = useRouter();
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const handleClicked = () => {
        giveRating(rentalId, rating, comment).then(isSucceed => {
            if (isSucceed) {
                // push(createUrl(pathName, searchParams));
                window.location.reload();
                // toast.success(message, {
                //     description: messageSuccess,
                // });
            } else {
                toast.error(message, {
                    description: messageError,
                });
            }
        });
    };

    return (
        <Button variant="default" onClick={handleClicked}>
            {confirmMessage}
        </Button>
    );
}
