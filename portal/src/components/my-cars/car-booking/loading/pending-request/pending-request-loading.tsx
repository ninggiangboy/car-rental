import { Skeleton } from '@/components/ui/skeleton';
import ListPagination from '@/components/cars/list-pagination';
import { PageMeta } from '@/lib/defines';
import RatingFilter from '../../tabs/report/rating-filter';
import StatusFilter from '../../tabs/report/status-filter';
import PendingCardLoading from './pending-card-loading';

const pageMetaDefault = {
    totalPages: 1,
    page: 0,
    pageSize: 0,
    hasNext: false,
    hasPrev: false,
} as PageMeta;

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

export default function PendingRequestLoading() {
    return (
        <>
            <div>
                <div className="mx-3 my-5 font-semibold h-[1.5rem] text-slate-700">
                    <Skeleton className="h-6 w-[250px]" />
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
