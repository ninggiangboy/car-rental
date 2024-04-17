'use client';

import Image from 'next/image';
import { fetchQrCode } from '@/lib/actions';
import { useEffect, useState } from 'react';

export default function QrCode({
    code,
    amount,
}: {
    code: string;
    amount: string;
}) {
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchQrCode(amount, code).then(data => setQrCode(data));
    }, []);
    if (!qrCode) {
        return <div>Loading...</div>;
    }
    return <Image alt="QR Code" src={qrCode} width={500} height={500} />;
}
