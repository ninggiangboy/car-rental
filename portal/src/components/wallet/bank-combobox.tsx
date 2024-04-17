'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
import { Bank } from '@/lib/defines';
import { fetchBankList } from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const frameworks = [
    {
        value: 'next.js',
        label: 'Next.js',
    },
    {
        value: 'sveltekit',
        label: 'SvelteKit',
    },
    {
        value: 'nuxt.js',
        label: 'Nuxt.js',
    },
    {
        value: 'remix',
        label: 'Remix',
    },
    {
        value: 'astro',
        label: 'Astro',
    },
];

export default function BankCombobox() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [bankList, setBankList] = useState([] as Bank[]);
    useEffect(() => {
        fetchBankList().then(bankList => {
            setBankList(bankList);
        });
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between "
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
                                style={{ objectFit: 'contain' }}
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
                    <CommandEmpty>No bank found.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-72">
                            {bankList.map(bank => (
                                <CommandItem
                                    key={bank.id}
                                    value={bank.shortName}
                                    onSelect={currentValue => {
                                        setValue(
                                            currentValue == value
                                                ? ''
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Image
                                        src={bank.logo}
                                        width={100}
                                        height={268}
                                        style={{ objectFit: 'contain' }}
                                        alt="bank image"
                                        className="bg-opacity-0"
                                    />
                                    {bank.shortName} ({bank.code})
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            value == bank.shortName
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
