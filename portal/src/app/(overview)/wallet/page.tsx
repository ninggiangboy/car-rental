import Balance from '@/components/wallet/balance';
import { CalendarDateRangePicker } from '@/components/wallet/date-range-picker';
import BalanceLoading from '@/components/wallet/loading/balance/balance-loading';
import TransactionTableLoading from '@/components/wallet/loading/transaction/transaction-table-loading';
import TransactionTable from '@/components/wallet/transaction-table';
import { Suspense } from 'react';

export default function WalletPage({
    searchParams,
}: {
    searchParams: {
        page: number;
        perPage: number;
        start: string;
        end: string;
    };
}) {
    return (
        <div className="bg-neutral-50 md:px-20 md:py-8 lg:px-32 lg:py-16 px-5 py-3">
            <Suspense
                key={searchParams.page + searchParams.start + searchParams.end}
                fallback={<BalanceLoading />}
            >
                <Balance />
            </Suspense>

            <div className="mt-10">
                <div className="text-2xl font-bold text-neutral-600 flex justify-between mb-5">
                    Transaction History
                </div>
                <CalendarDateRangePicker />

                <Suspense
                    key={
                        searchParams.page +
                        searchParams.perPage +
                        searchParams.start +
                        searchParams.end
                    }
                    fallback={<TransactionTableLoading />}
                >
                    <TransactionTable
                        page={searchParams.page}
                        perPage={searchParams.perPage}
                        start={searchParams.start}
                        end={searchParams.end}
                    />
                </Suspense>
            </div>
        </div>
    );
}
