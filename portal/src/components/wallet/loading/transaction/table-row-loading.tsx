import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export default function TableRowLoading() {
    return (
        <TableRow className="h-[1.25rem]">
            <TableCell className="font-medium ">
                <Skeleton className="h-[1.25rem] w-[100px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[60px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[100px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[50px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[80px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[100px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-[1.25rem] w-[100px]" />
            </TableCell>
            <TableCell className="flex justify-end ">
                <Skeleton className="h-[1.25rem] w-[170px]" />
            </TableCell>
        </TableRow>
    );
}
