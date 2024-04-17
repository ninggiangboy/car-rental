'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { fetchRentalTransactionHistory } from '@/lib/actions';
import { Transaction } from '@/lib/defines';
import { getDateFormatted } from '@/lib/utils';
import { useEffect, useState } from 'react';
import TransactionTableLoading from '../../loading/report/transaction-table-loading';

const TransactionTable = ({
    rentalId,
    status,
}: {
    rentalId: number;
    status?: boolean;
}) => {
    const [transactions, setTransactions] = useState([] as Transaction[]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchRentalTransactionHistory(rentalId).then(data => {
            setTransactions(data);
            setLoading(false);
        });
    }, [rentalId]);

    if (loading) {
        if (status) {
            return <TransactionTableLoading status />;
        }
        return <TransactionTableLoading />;
    }
    return (
        <div className="w-full">
            {transactions?.length === 0 ? (
                <div className="text-center">No transaction found</div>
            ) : (
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}

                    <TableHeader>
                        <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Time</TableHead>
                            {status && <TableHead>Status</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(transaction => (
                            <TableRow key={transaction.transactionCode}>
                                <TableCell className="font-medium">
                                    {transaction.paymentMethod === 'CASH' &&
                                        '$'}
                                    {transaction.amount}{' '}
                                    {transaction.paymentMethod === 'WALLET' &&
                                        'Point'}
                                </TableCell>
                                <TableCell>
                                    {transaction.paymentMethod}
                                </TableCell>
                                <TableCell>
                                    {transaction.transactionType}
                                </TableCell>
                                <TableCell>
                                    {getDateFormatted(transaction.createdAt)}
                                </TableCell>
                                {status && (
                                    <TableCell>
                                        {transaction.transactionStatus}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default TransactionTable;
