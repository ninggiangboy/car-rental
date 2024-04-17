'use client';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { fetchAvailableDate } from '@/lib/actions';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { AvailableDate } from '@/lib/defines';

const SelectTime = async ({
    dates,
}: Readonly<{
    dates: AvailableDate[];
}>) => {
    return (
        <div className="flex flex-col w-[100%] gap-2 cursor-pointer">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className="w-full font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dates.length === 0
                            ? 'Not have available dates to rent'
                            : 'Avaiable dates to rent'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        mode="single"
                        numberOfMonths={2}
                        initialFocus
                        disabled={date => {
                            return (
                                addDays(date, 1) < new Date() ||
                                !dates.some(
                                    d =>
                                        isAfter(
                                            startOfDay(addDays(date, 1)),
                                            startOfDay(d.startDate)
                                        ) &&
                                        isBefore(
                                            startOfDay(date),
                                            startOfDay(addDays(d.endDate, 1))
                                        )
                                )
                            );
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SelectTime;
