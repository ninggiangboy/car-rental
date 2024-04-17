import { Skeleton } from '@/components/ui/skeleton';
import ReportCardLoading from './report-card-loading';
import ListPagination from '@/components/cars/list-pagination';
import { PageMeta } from '@/lib/defines';
import RatingFilter from '../../tabs/report/rating-filter';
import StatusFilter from '../../tabs/report/status-filter';

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

export default function ReportLoading() {
    return (
        <>
            <div className="my-5 flex gap-2">
                <RatingFilter />
                <StatusFilter options={options} />
            </div>
            <div>
                <div className="mx-3 my-5 font-semibold h-[1.5rem] text-slate-700">
                    <Skeleton className="h-6 w-[150px]" />
                </div>
                <div className="grid lg:grid-cols-3 gap-5 mb-5">
                    <ReportCardLoading />
                    <ReportCardLoading />
                    <ReportCardLoading />
                </div>

                <ListPagination meta={pageMetaDefault} />
            </div>
        </>
    );
}
