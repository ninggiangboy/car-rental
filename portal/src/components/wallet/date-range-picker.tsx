'use client';

import { cn, createUrl } from '@/lib/utils';
import { format } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '../ui/calendar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function CalendarDateRangePicker() {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);

    const searchParams = useSearchParams();
    const { push } = useRouter();
    const pathName = usePathname();
    const handleApply = () => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('start');
        newParams.delete('end');
        newParams.delete('page');
        newParams.set(
            'start',
            date?.from ? format(date.from, 'yyyy-MM-dd') : ''
        );
        newParams.set('end', date?.to ? format(date.to, 'yyyy-MM-dd') : '');
        push(createUrl(pathName, newParams));
    };

    return (
        <div className="flex gap-2">
            <div className="grid gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'w-[260px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y')} -{' '}
                                        {format(date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            disabled={day => day > new Date()}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Button onClick={handleApply} variant={'default'}>
                Apply
            </Button>
        </div>
    );
}
