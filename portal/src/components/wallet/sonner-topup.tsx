'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { topUp } from '@/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';

export function SonnerTopup({
    isConfirmed,
    confirmMessage,
    message,
    messageSuccess,
    messageError,
    amount,
}: Readonly<{
    isConfirmed: boolean;
    confirmMessage: string;
    message: string;
    messageSuccess: string;
    messageError: string;
    amount: string;
}>) {
    const { push } = useRouter();
    const pathName = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());

    const handleClicked = () => {
        topUp(amount).then(code => {
            if (code) {
                // toast.success(messageSuccess);
                searchParams.set('topup', 'success');
                searchParams.set('code', code);
                searchParams.set('amount', amount);
                push(createUrl(pathName, searchParams));
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
