import ListPagination from '@/components/cars/list-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PageMeta } from '@/lib/defines';
import TableRowLoading from './table-row-loading';

const pageMetaDefault = {
    totalPages: 1,
    page: 0,
    pageSize: 0,
    hasNext: false,
    hasPrev: false,
} as PageMeta;

export default function TransactionTableLoading() {
    return (
        <>
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Code</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Booking No.</TableHead>
                        <TableHead>Payment method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead className="text-right">
                            Description
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                    <TableRowLoading />
                </TableBody>
            </Table>
            <div className="mt-5">
                <ListPagination meta={pageMetaDefault} />
            </div>
        </>
    );
}
