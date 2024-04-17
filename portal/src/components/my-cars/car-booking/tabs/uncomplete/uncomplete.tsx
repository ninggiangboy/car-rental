import ListPagination from '@/components/cars/list-pagination';
import UncompleteList from './uncomplete-list';
import { fetchBookingListRecord } from '@/lib/actions';
import StatusFilter from '../report/status-filter';

const options = [
    {
        label: 'In Progress',
        value: 'IN_PROGRESS',
        field: 'IN_PROGRESS',
    },
    {
        label: 'Pending deposit',
        value: 'PENDING_DEPOSIT',
        field: 'PENDING_DEPOSIT',
    },
    {
        label: 'Pending pickup',
        value: 'PENDING_PICKUP',
        field: 'PENDING_PICKUP',
    },
    {
        label: 'Pending payment',
        value: 'PENDING_PAYMENT',
        field: 'PENDING_PAYMENT',
    },
    {
        label: 'Pending confirm payment',
        value: 'PENDING_CONFIRM_PAYMENT',
        field: 'PENDING_CONFIRM_PAYMENT',
    },
];

export default async function Uncomplete({
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
        statusFilter
            ? statusFilter
            : 'IN_PROGRESS,PENDING_DEPOSIT,PENDING_PICKUP,PENDING_PAYMENT,PENDING_CONFIRM_PAYMENT'
    );

    return (
        <>
            <div className="my-5 flex gap-2">
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
                            You have {pageMeta.totalElements} ongoing rental(s)
                        </div>

                        <UncompleteList bookingList={bookingList} />

                        {/* Start pagimation */}
                        <ListPagination meta={pageMeta} />
                        {/* End pagimation */}
                    </>
                ) : (
                    <div className="my-10">
                        <h1 className="text-xl font-semibold text-slate-700">
                            No ongoing rental
                        </h1>
                    </div>
                )}
            </div>
        </>
    );
}
