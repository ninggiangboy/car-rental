'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import React, { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn, createUrl } from '@/lib/utils';
import {
    CheckIcon,
    MixerHorizontalIcon,
    StarFilledIcon,
} from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchParams } from '@/lib/defines';

const options = [
    {
        label: '5',
        value: '5',
        field: '5',
    },
    {
        label: '4',
        value: '4',
        field: '4',
    },
    {
        label: '3',
        value: '3',
        field: '3',
    },
    {
        label: '2',
        value: '2',
        field: '2',
    },
    {
        label: '1',
        value: '1',
        field: '1',
    },
];

export default function RatingFilter({
    carId,
}: Readonly<{ rate?: string; carId?: number }>) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const rate = searchParams.get('rating');
    const [selected, setSelected] = React.useState<string[]>([]);
    useEffect(() => {
        if (rate) setSelected(rate.split(','));
    }, [rate]);

    const handleSortChange = useDebouncedCallback(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('rating');
        newParams.delete(SearchParams.PAGE);
        if (selected) newParams.set('rating', selected.join(','));
        push(createUrl(`/my-cars/${carId}`, newParams));
    }, 600);

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <MixerHorizontalIcon className="mr-2 size-4" /> Rating{' '}
                        {selected.length > 0 && (
                            <>
                                <Separator
                                    orientation="vertical"
                                    className="mx-2 h-4"
                                />
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal lg:hidden"
                                >
                                    {selected.length}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {selected
                                        .map(selectedValue =>
                                            options.find(
                                                option =>
                                                    option.value ===
                                                    selectedValue
                                            )
                                        )
                                        .filter(Boolean)
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={option?.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option?.label}
                                            </Badge>
                                        ))}
                                </div>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map(option => {
                                    const isSelected = selected.includes(
                                        option.value
                                    );
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                if (!isSelected) {
                                                    const newSelected =
                                                        selected.filter(
                                                            item => {
                                                                const currentItemField =
                                                                    options.find(
                                                                        option =>
                                                                            option.value ===
                                                                            item
                                                                    )?.field;
                                                                const selectedOptionField =
                                                                    option.field;
                                                                return (
                                                                    currentItemField !==
                                                                    selectedOptionField
                                                                );
                                                            }
                                                        );
                                                    newSelected.push(
                                                        option.value
                                                    );
                                                    setSelected(newSelected);
                                                } else {
                                                    setSelected(
                                                        selected.filter(
                                                            item =>
                                                                item !==
                                                                option.value
                                                        )
                                                    );
                                                }
                                                handleSortChange();
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'opacity-50 [&_svg]:invisible'
                                                )}
                                            >
                                                <CheckIcon
                                                    className={cn('size-4')}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                {Array.from({
                                                    length: +option.value,
                                                }).map((_, index) => (
                                                    <StarFilledIcon
                                                        key={index}
                                                        className="size-4 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            {selected.length > 0 && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => {
                                                setSelected([]);
                                                const newParams =
                                                    new URLSearchParams(
                                                        searchParams.toString()
                                                    );
                                                newParams.delete('rating');
                                                push(
                                                    createUrl(
                                                        `/my-cars/${carId}`,
                                                        newParams
                                                    )
                                                );
                                            }}
                                            className="justify-center text-center"
                                        >
                                            Clear filter
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
