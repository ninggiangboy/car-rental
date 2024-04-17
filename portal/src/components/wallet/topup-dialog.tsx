'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircledIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import QrCodeModal from './qr-code';
import { topUp } from '@/lib/actions';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '../ui/alert-dialog';
import { getFormatPoint } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import QrCode from './qr-code';

const amountOptions = ['50', '100', '200', '500', '1.000', '5.000'];

export default function TopUpDialog() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [isValid, setIsValid] = useState(false);

    const handleInput = (value: string) => {
        const valueNumber = Number(value.replace(/\D/g, ''));
        setAmount(getFormatPoint(valueNumber));
    };

    useEffect(() => {
        const valueNumber = Number(amount.replace(/\D/g, ''));
        if (valueNumber > 1000000 || valueNumber < 50) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [amount]);

    const [isSuccess, setIsSuccess] = useState(false);
    const [code, setCode] = useState('' as string);

    const handleClicked = () => {
        topUp(amount).then(code => {
            if (code) {
                toast.success('Create top up request success!');
                setCode(code);
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
                toast.error('Top up', {
                    description:
                        'Create top up request failed, please try again later.',
                });
            }
        });
    };

    const handleClear = () => {
        setIsSuccess(false);
        router.refresh();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" /> TopUp
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Top up</AlertDialogTitle>
                </AlertDialogHeader>

                {isSuccess ? (
                    <div>
                        {/* <CheckCircledIcon className="h-6 w-6 mx-auto text-green-500 mb-2" /> */}
                        <div className="text-sm text-center">
                            {`Created top up request for ${amount} point.`}
                        </div>
                        <div className="text-xs text-slate-500 mt-2 text-center">
                            The transaction will be processed within 48 hours.
                            If not processed, the transaction will be
                            automatically canceled.
                        </div>
                        <div className="mt-5 flex justify-center">
                            <QrCode code={code} amount={amount} />
                        </div>
                        <div className="w-full flex justify-center mt-3">
                            <AlertDialogAction onClick={handleClear}>
                                Close
                            </AlertDialogAction>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-3 gap-2">
                            {amountOptions.map(option => (
                                <Button
                                    key={option}
                                    variant="outline"
                                    onClick={() => {
                                        setAmount(option);
                                    }}
                                >
                                    {option} point
                                </Button>
                            ))}
                        </div>
                        <AlertDialogDescription className="mt-2">
                            Note: 1 point = $1
                        </AlertDialogDescription>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    value={amount}
                                    onChange={e => handleInput(e.target.value)}
                                    className="col-span-3"
                                />
                                <AlertDialogDescription>
                                    Amount must be between 50 and 1.000.000
                                    point
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                variant="default"
                                onClick={handleClicked}
                                disabled={!isValid}
                            >
                                Top up
                            </Button>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
}
