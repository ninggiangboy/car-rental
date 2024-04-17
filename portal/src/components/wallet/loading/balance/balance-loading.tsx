import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getFormatPoint } from '@/lib/utils';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import BalanceCardLoading from './balance-card-loading';

export default function BalanceLoading() {
    return (
        <>
            <div className="grid gap-y-4 md:gap-4 grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-neutral-600 flex justify-between">
                        My Wallet
                        <div className="flex gap-2 h-[2rem]">
                            <Button variant="outline">
                                <PlusIcon className="h-4 w-4 mr-2" /> TopUp
                            </Button>
                            <Button variant="outline">
                                <MinusIcon className="h-4 w-4 mr-2" /> Withdraw
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <div className="grid gap-4 md:grid-cols-1 mt-5">
                            <BalanceCardLoading />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col col-span-2">
                    <div
                        className={`text-2xl font-bold text-neutral-600 flex justify-between`}
                    >
                        Wallet Pending
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-5">
                        <BalanceCardLoading />
                        <BalanceCardLoading />
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div
                    className={`text-2xl font-bold text-neutral-600 flex justify-between`}
                >
                    Wallet Pending
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-5">
                    <BalanceCardLoading />
                    <BalanceCardLoading />
                </div>
            </div>
        </>
    );
}
