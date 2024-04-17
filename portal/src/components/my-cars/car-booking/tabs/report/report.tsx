import ListPagination from '@/components/cars/list-pagination';
import RatingFilter from './rating-filter';
import ReportCard from './report-card';
import StatusFilter from './status-filter';
import { fetchBookingListRecord, wait } from '@/lib/actions';

const options = [
    {
        label: 'Rejected',
        value: 'REJECTED',
        field: 'REJECTED',
    },
    {
        label: 'Cancelled',
        value: 'CANCELLED',
        field: 'CANCELLED',
    },
    {
        label: 'Completed',
        value: 'COMPLETED',
        field: 'COMPLETED',
    },
];

export default async function Report({
    ratingFilter,
    statusFilter,
    carId,
    page,
}: {
    ratingFilter: string;
    statusFilter: string;
    carId: number;
    page: number;
}) {
    const { bookingList, pageMeta } = await fetchBookingListRecord(
        carId,
        page,
        ratingFilter,
        statusFilter ? statusFilter : 'REJECTED,CANCELLED,COMPLETED'
    );

    return (
        <>
            <div className="my-5 flex gap-2">
                <RatingFilter carId={carId} rate={ratingFilter} />
                <StatusFilter
                    carId={carId}
                    sort={statusFilter}
                    options={options}
                />
            </div>
            <div>
                {pageMeta.totalElements > 0 ? (
                    <>
                        <div className="mx-3 my-5 font-semibold text-slate-700">
                            Found {pageMeta.totalElements} report(s)
                        </div>
                        {/* Start booking list */}
                        <div className="grid lg:grid-cols-3 gap-5 mb-5">
                            {bookingList.map(booking => (
                                <ReportCard
                                    key={booking.id}
                                    booking={booking}
                                />
                            ))}
                        </div>
                        {/* End booking list */}

                        {/* Start pagimation */}
                        <ListPagination meta={pageMeta} />
                        {/* End pagimation */}
                    </>
                ) : (
                    <div className="my-10">
                        <h1 className="text-xl font-semibold text-slate-700">
                            Found no report.
                        </h1>
                    </div>
                )}
            </div>
        </>
    );
}
