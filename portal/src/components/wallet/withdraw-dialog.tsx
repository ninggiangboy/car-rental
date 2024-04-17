'use client';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircledIcon, MinusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { getFormatPoint } from '@/lib/utils';
import { fetchBankList, withdraw } from '@/lib/actions';
import { Bank } from '@/lib/defines';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const amountOptions = ['50', '100', '200', '500', '1.000', '5.000'];

export default function WithdrawAlertDialog() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [bankNumber, setBankNumber] = useState('' as string);
    const [bankCode, setBankCode] = useState('' as string);
    const [bank, setBank] = useState('' as string);
    const [isValid, setIsValid] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [bankList, setBankList] = useState([] as Bank[]);

    const handleAmountInput = (value: string) => {
        const valueNumber = Number(value.replace(/\D/g, ''));
        setAmount(getFormatPoint(valueNumber));
    };
    const handleBankNumberInput = (value: string) => {
        setBankNumber(value);
    };

    useEffect(() => {
        const valueNumber = Number(amount.replace(/\D/g, ''));
        if (
            valueNumber > 1000000 ||
            valueNumber < 50 ||
            value === '' ||
            bankNumber === ''
        ) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [amount, value, bankNumber]);

    useEffect(() => {
        fetchBankList().then(bankList => {
            setBankList(bankList);
        });
    }, []);

    const [isSuccess, setIsSuccess] = useState(false);

    const handleClicked = () => {
        withdraw(amount, bank, bankCode, bankNumber).then(code => {
            if (code.isSuccess) {
                // toast.success('Create withdraw request success!');
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
                toast.error('Withdraw', {
                    description: code.message
                        ? code.message
                        : 'Create withdraw request failed, please try again later.',
                });
            }
        });
    };

    const handleClear = () => {
        setAmount('');
        setValue('');
        setBankNumber('');
        setIsSuccess(false);
        router.refresh();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <MinusIcon className="h-4 w-4 mr-2" /> Withdraw
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw</AlertDialogTitle>
                </AlertDialogHeader>

                {isSuccess ? (
                    <div>
                        <CheckCircledIcon className="h-6 w-6 mx-auto text-green-500 mb-2" />
                        <div className="text-center">
                            {`Created withdraw request for $${amount}.`}
                        </div>
                        <div className="text-sm text-slate-500 mt-2 text-center">
                            The transaction will be processed within 48 hours.
                            If not processed, the transaction will be
                            automatically canceled.
                        </div>
                        <div className="w-full flex justify-center mt-3">
                            <AlertDialogAction onClick={handleClear}>
                                Close
                            </AlertDialogAction>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div>
                            {/* Begin Select Bank */}
                            <div className="flex flex-col gap-2 ">
                                <Label>Bank</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {value ? (
                                                <div className="flex gap-2">
                                                    <Image
                                                        src={
                                                            bankList.find(
                                                                bank =>
                                                                    bank.shortName.toLowerCase() ==
                                                                    value
                                                            )?.logo || ''
                                                        }
                                                        width={100}
                                                        height={268}
                                                        style={{
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                        alt="bank image"
                                                    />
                                                    <Separator orientation="vertical" />
                                                    <div className="flex flex-col justify-center">
                                                        {
                                                            bankList.find(
                                                                bank =>
                                                                    bank.shortName.toLowerCase() ==
                                                                    value
                                                            )?.shortName
                                                        }{' '}
                                                        (
                                                        {
                                                            bankList.find(
                                                                bank =>
                                                                    bank.shortName.toLowerCase() ==
                                                                    value
                                                            )?.code
                                                        }
                                                        )
                                                    </div>
                                                </div>
                                            ) : (
                                                'Select bank...'
                                            )}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search bank..."
                                                className="h-9"
                                            />
                                            <CommandEmpty>
                                                No bank found.
                                            </CommandEmpty>
                                            <CommandGroup className="h-72">
                                                {/* <ScrollArea className="h-72"> */}
                                                {bankList.map(bank => (
                                                    <CommandItem
                                                        key={bank.id}
                                                        value={bank.shortName}
                                                        onSelect={currentValue => {
                                                            setValue(
                                                                currentValue ==
                                                                    value
                                                                    ? ''
                                                                    : currentValue
                                                            );
                                                            setBank(bank.name);
                                                            setBankCode(
                                                                bank.code
                                                            );
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Image
                                                            src={bank.logo}
                                                            width={100}
                                                            height={268}
                                                            style={{
                                                                objectFit:
                                                                    'contain',
                                                            }}
                                                            alt="bank image"
                                                            className="bg-opacity-0"
                                                        />
                                                        {bank.shortName} (
                                                        {bank.code})
                                                        <CheckIcon
                                                            className={cn(
                                                                'ml-auto h-4 w-4',
                                                                value ==
                                                                    bank.shortName
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                                {/* </ScrollArea> */}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {/* End Select Bank */}

                            <div className="flex flex-col gap-2 mt-5 mb-2">
                                <Label htmlFor="bank-number">Bank number</Label>
                                <Input
                                    id="bank-number"
                                    value={bankNumber}
                                    onChange={e =>
                                        handleBankNumberInput(e.target.value)
                                    }
                                    className="col-span-3"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-2 mt-5">
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
                        <AlertDialogDescription className="mb-5">
                            Note: 1 point = $1
                        </AlertDialogDescription>

                        <div className="grid gap-4 pb-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    value={amount}
                                    onChange={e =>
                                        handleAmountInput(e.target.value)
                                    }
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
                                Withdraw
                            </Button>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
}
