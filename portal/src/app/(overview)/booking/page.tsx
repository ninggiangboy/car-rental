import BookingList from '@/components/booking/booking';
import BookingNotFound from '@/components/booking/booking-not-found';
import FilterBooking from '@/components/booking/filter-booking';
import SortSelectBooking from '@/components/booking/sort-select-booking';
import { fetchBookingHistory, getUserRole } from '@/lib/actions';
import { ROLE } from '@/lib/defines';
import { Suspense } from 'react';
import BookingLoading from '@/components/booking/booking-loading/booking-loading';

export default async function BookingPage({
    searchParams,
}: {
    searchParams: {
        page: number;
        perPage: number;
        status: string;
        sort: string;
    };
}) {
    const { bookings, pageMeta } = await fetchBookingHistory(
        searchParams.page,
        searchParams.perPage,
        searchParams.status,
        searchParams.sort
    );

    const userRole = await getUserRole();

    if (userRole !== ROLE.CUSTOMER) {
        return <BookingNotFound />;
    }

    return (
        <>
            <span className={`text-3xl font-bold text-neutral-600`}>
                My Bookings
            </span>
            <div className="flex justify-between mt-5">
                <div className="flex gap-2">
                    <FilterBooking sort={searchParams.status} />
                    <SortSelectBooking sort={searchParams.sort} />
                </div>
            </div>
            <Suspense fallback={<BookingLoading />}>
                <BookingList
                    listBookings={bookings}
                    searchParams={searchParams}
                    pageMeta={pageMeta}
                />
            </Suspense>
        </>
    );
}
