import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function TransactionTableLoading({
    status,
}: {
    status?: boolean;
}) {
    return (
        <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableHead>
                    {status && (
                        <TableHead>
                            <Skeleton className="h-4 w-[50px]" />
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    {status && (
                        <TableHead>
                            <Skeleton className="h-4 w-[50px]" />
                        </TableHead>
                    )}
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    {status && (
                        <TableHead>
                            <Skeleton className="h-4 w-[50px]" />
                        </TableHead>
                    )}
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    {status && (
                        <TableHead>
                            <Skeleton className="h-4 w-[50px]" />
                        </TableHead>
                    )}
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
