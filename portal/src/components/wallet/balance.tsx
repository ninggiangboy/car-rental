import {
    fetchPendingTransaction,
    fetchUserBalance,
    fetchWalletInfo,
    wait,
} from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TopUpDialog from './topup-dialog';
import WithdrawDialog from './withdraw-dialog';
import { getFormatPoint } from '@/lib/utils';
import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';

const Balance = async () => {
    await wait(1000);
    const balance = await fetchUserBalance();
    // const { pendingReceive, pendingPayment } = await fetchPendingTransaction();
    const {
        pendingReceive,
        pendingPayment,
        pendingReceiveWallet,
        pendingPaymentWallet,
    } = await fetchWalletInfo();

    return (
        <>
            <div className="grid gap-y-4 md:gap-4 grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-neutral-600 flex justify-between">
                        My Wallet
                        <div className="flex gap-2 h-[2rem]">
                            <TopUpDialog />
                            <WithdrawDialog />
                        </div>
                    </div>
                    <div className="">
                        <div className="grid gap-4 md:grid-cols-1 mt-5">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Balance
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect
                                            width="20"
                                            height="14"
                                            x="2"
                                            y="5"
                                            rx="2"
                                        />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent className="flex justify-between">
                                    <div className="text-2xl font-bold">
                                        {getFormatPoint(balance)} point
                                    </div>
                                </CardContent>
                            </Card>
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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending topup
                                </CardTitle>
                                <ThickArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {getFormatPoint(pendingReceiveWallet)} point
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending withdraw
                                </CardTitle>
                                <ThickArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {getFormatPoint(pendingPaymentWallet)} point
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div
                    className={`text-2xl font-bold text-neutral-600 flex justify-between`}
                >
                    Transaction Pending
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending payments
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                ${getFormatPoint(pendingPayment)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending receive
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                ${getFormatPoint(pendingReceive)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Balance;
