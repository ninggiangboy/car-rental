import { fetchBookingListRecord } from '@/lib/actions';
import ListPagination from '@/components/cars/list-pagination';
import PendingRequestList from './pending-request-list';

export default async function PendingRequest({
    statusFilter,
    carId,
    page,
}: {
    statusFilter: string;
    carId: number;
    page: number;
}) {
    const { bookingList, pageMeta } = await fetchBookingListRecord(
        carId,
        page,
        undefined,
        statusFilter ? statusFilter : 'PENDING',
        1000
    );

    return (
        <>
            <div>
                {pageMeta.totalElements > 0 ? (
                    <>
                        <div className="mx-3 my-5 font-semibold text-slate-700">
                            You have {pageMeta.totalElements} pending request(s)
                        </div>

                        <PendingRequestList bookingList={bookingList} />
                    </>
                ) : (
                    <div className="my-10">
                        <h1 className="text-xl font-semibold text-slate-700">
                            No pending request
                        </h1>
                    </div>
                )}
            </div>
        </>
    );
}
