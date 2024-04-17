import { Skeleton } from '@/components/ui/skeleton';
import ListPagination from '@/components/cars/list-pagination';
import { PageMeta } from '@/lib/defines';
import RatingFilter from '../../tabs/report/rating-filter';
import StatusFilter from '../../tabs/report/status-filter';
import PendingCardLoading from '../pending-request/pending-card-loading';

const pageMetaDefault = {
    totalPages: 1,
    page: 0,
    pageSize: 0,
    hasNext: false,
    hasPrev: false,
} as PageMeta;

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
];

export default function UncompleteLoading() {
    return (
        <>
            <div className="my-5 flex gap-2">
                <StatusFilter options={options} />
            </div>
            <div>
                <div className="mx-3 my-5 font-semibold h-[1.5rem] text-slate-700">
                    <Skeleton className="h-6 w-[150px]" />
                </div>
                <div className="grid lg:grid-cols-3 gap-5 mb-5">
                    <PendingCardLoading />
                    <PendingCardLoading />
                    <PendingCardLoading />
                </div>

                <ListPagination meta={pageMetaDefault} />
            </div>
        </>
    );
}
