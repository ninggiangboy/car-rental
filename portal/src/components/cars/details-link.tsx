'use client';

import { SearchParams } from '@/lib/defines';
import { createUrl } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DetailsLink({ id }: { id: number }) {
    const search = useSearchParams();
    const checkin = search.get(SearchParams.CHECKIN);
    const checkout = search.get(SearchParams.CHECKOUT);
    const location = search.get(SearchParams.LOCATION);
    const newParams = new URLSearchParams();
    newParams.set(SearchParams.CHECKIN, checkin || '');
    newParams.set(SearchParams.CHECKOUT, checkout || '');
    newParams.set(SearchParams.LOCATION, location || '');
    const url = createUrl(`/cars/${id}`, newParams);
    return <Link href={url}>Details</Link>;
}
