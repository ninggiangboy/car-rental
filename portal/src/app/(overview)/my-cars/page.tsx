import { ROLE, SearchCarParams } from '@/lib/defines';
import React from 'react';
import { fetchMyCarList, getUserRole } from '@/lib/actions';
import CarList from '@/components/my-cars/my-cars';
import ListPagination from '@/components/cars/list-pagination';
import Analysis from '@/components/my-cars/analysis/analysis';
import RecentBookingCarousel from '@/components/my-cars/recent-booking/recent-booking-carousel';
import BookingNotFound from '@/components/booking/booking-not-found';

export default async function MyCarList({
    searchParams,
}: Readonly<{ searchParams: SearchCarParams }>) {
    const { cars, pageMeta } = await fetchMyCarList(searchParams);
    const userRole = await getUserRole();

    if (userRole !== ROLE.CAROWNER) {
        return <BookingNotFound />;
    }

    return (
        <>
            <div className="bg-neutral-50 md:px-20 md:py-8 lg:px-32 lg:py-16 px-5 py-3">
                <div className={`text-3xl font-bold mt-5`}>Recent Bookings</div>
                <RecentBookingCarousel />
                <span className={`text-3xl font-bold`}>My Cars</span>
                <Analysis />

                <CarList cars={cars} />
                <ListPagination meta={pageMeta} />
            </div>
        </>
    );
}
