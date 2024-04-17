import { Booking, PageMeta } from '@/lib/defines';
import BookingThumbnail from './booking-thumbnail';
import ListPagination from '../cars/list-pagination';

export default function BookingList({
    listBookings,
    searchParams,
    pageMeta,
}: Readonly<{
    listBookings: Booking[];
    searchParams: { status: string; sort: string };
    pageMeta: PageMeta;
}>) {
    return (
        <div>
            {pageMeta.totalElements > 0 ? (
                <>
                    <div className="mx-3 mt-5 font-semibold text-slate-700">
                        You have {pageMeta.totalElements} booking(s)
                    </div>
                    <div>
                        {listBookings.map(booking => (
                            <BookingThumbnail
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                    <ListPagination meta={pageMeta} />
                </>
            ) : (
                <div className="my-10">
                    <h1 className="text-xl font-semibold text-slate-700">
                        You have no booking yet
                    </h1>
                </div>
            )}
        </div>
    );
}
