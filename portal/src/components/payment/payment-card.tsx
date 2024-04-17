'use client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { CarReservation, RentalInfo } from '@/lib/defines';
import { format } from 'date-fns';
import { payDeposit, payRent } from '@/lib/actions';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { AlertDialogHeader } from '../ui/alert-dialog';

export default function PaymentCard({
    amount,
    balance,
    car,
    rental,
    typePayment,
}: {
    amount: number;
    balance: number;
    car: CarReservation;
    rental: RentalInfo;
    typePayment?: string;
}) {
    type typeMethod = undefined | 'WALLET' | 'BANK' | 'CASH';
    const [method, setMethod] = useState<typeMethod>();
    const { push } = useRouter();
    const onSubmit = async () => {
        const result =
            typePayment == 'DEPOSIT'
                ? await payDeposit(rental.id, method as string)
                : await payRent(rental.id, method as string);
        if (!result) toast.error('Failed to pay deposit');
        else push(`/payment/finish?method=${method}`);
    };
    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>{`Payment ${typePayment?.toLowerCase()} for rental`}</CardTitle>
                <p className="mt-5 text-lg font-bold">{`${car.carName}`}</p>
                <div className="text-sm">
                    <p>{`Pick-up: ${format(rental.startDate, 'hh:mma PPP')}`}</p>
                    <p>{`Drop-off: ${format(rental.endDate, 'hh:mma PPP')}`}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-center mb-5">
                            <span className="font-medium">Amount:</span>
                            <span className="font-bold text-xl">
                                {method === 'WALLET'
                                    ? ` ${amount} Point`
                                    : ` $${amount}`}
                            </span>
                            <div className="flex flex-col justify-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <QuestionMarkCircledIcon />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <AlertDialogHeader>
                                            <DialogTitle>
                                                Term and Conditions
                                            </DialogTitle>
                                            <div className="text-sm text-muted-foreground">
                                                Understanding and Acceptance of
                                                Terms: By opting for the cash
                                                payment method on the website,
                                                Customers and Hosts acknowledge
                                                and agree to the terms and
                                                conditions governing this
                                                payment option.
                                            </div>

                                            <div className="p-3 pt-0 text-sm text-muted-foreground">
                                                <h1 className="font-bold text-black">
                                                    Cash
                                                </h1>
                                                <ol className="list-[number]">
                                                    <li className="mt-2">
                                                        Payment Responsibility:
                                                        Customers and Hosts bear
                                                        full responsibility for
                                                        any cash transactions.
                                                        The system is not liable
                                                        for verifying accuracy
                                                        or resolving disputes
                                                        related to these
                                                        transactions.
                                                    </li>
                                                    <li className="mt-2">
                                                        Payment Confirmation:
                                                        Customers and Hosts are
                                                        responsible for
                                                        confirming payments and
                                                        managing transaction
                                                        information. The website
                                                        does not handle or
                                                        retain details of cash
                                                        payment accounts.
                                                    </li>
                                                </ol>
                                                <h1 className="font-bold text-black mt-3">
                                                    Point
                                                </h1>
                                                <ol className="list-[number]">
                                                    <li className="mt-2">
                                                        Our website include
                                                        services for use with
                                                        our point. It can be
                                                        bought from us for real
                                                        money, with conversion
                                                        ratio: 1 point = 1$. You
                                                        agree that you will only
                                                        be able to obtain point
                                                        from us, and not from
                                                        any third party.
                                                    </li>
                                                    <li className="mt-2">
                                                        Payment Responsibility:
                                                        The system is liable for
                                                        verifying accuracy and
                                                        resolving disputes
                                                        related to these
                                                        transactions.
                                                    </li>
                                                    <li className="mt-2">
                                                        Payment Confirmation:
                                                        Customers and Hosts are
                                                        responsible for
                                                        confirming payments and
                                                        managing transaction
                                                        information.
                                                    </li>
                                                </ol>
                                            </div>
                                        </AlertDialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <Select onValueChange={m => setMethod(m as typeMethod)}>
                            <SelectTrigger id="method">
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="WALLET">
                                    My Wallet (Point Conversion)
                                </SelectItem>
                                <SelectItem value="CASH">
                                    Cash / Bank (User Self Trade)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {method === 'WALLET' && (
                            <div className="flex gap-2 rounded-md border p-4 shadow text-sm">
                                <span>Balance: </span>
                                <span
                                    className={cn(
                                        'font-medium',
                                        balance > amount
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    )}
                                >{`${balance} Point`}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button
                    disabled={
                        method === undefined ||
                        (method === 'WALLET' && balance < amount)
                    }
                    onClick={() => onSubmit()}
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>
    );
}
