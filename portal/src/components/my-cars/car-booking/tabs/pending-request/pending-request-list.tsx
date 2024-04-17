'use client';

import { BookingListRecord } from '@/lib/defines';
import PendingCard from './pending-card';
import { useState } from 'react';
import { addMinutes, isAfter, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';

type DateRange = {
    from: Date;
    to: Date;
};
export default function PendingRequestList({
    bookingList,
}: {
    bookingList: BookingListRecord[];
}) {
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disabledList, setDisabledList] = useState<number[]>([]);
    const handleClick = (id: number) => {
        const newCheckedList = [...checkedList];
        if (disabledList.includes(id)) return;
        if (checkedList.includes(id)) {
            newCheckedList.splice(checkedList.indexOf(id), 1);
            setCheckedList(checkedList.filter(item => item !== id));
        } else {
            newCheckedList.push(id);
            setCheckedList([...newCheckedList]);
        }
        const dates = newCheckedList.map(id => ({
            from: new Date(
                bookingList.find(b => b.id === id)?.rentalStart || ''
            ),
            to: new Date(bookingList.find(b => b.id === id)?.rentalEnd || ''),
        }));
        const newDisableList = bookingList
            .filter(booking => !newCheckedList.includes(booking.id))
            .filter(booking => {
                return dates.some(date => {
                    if (
                        isBefore(
                            new Date(booking.rentalStart),
                            addMinutes(date.to, 10)
                        ) &&
                        isAfter(
                            addMinutes(new Date(booking.rentalEnd), 10),
                            date.from
                        )
                    )
                        return true;
                    return false;
                });
            })
            .map(b => b.id);
        setDisabledList([...newDisableList]);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {/* <div className="col-span-3">
                <div className="flex justify-start gap-4 items-center bg-accent-100 rounded-md px-3 py-2 h-[1.5rem]">
                    <div className="w-[300px]">
                        Total Price ({`${checkedList.length} selected`}): $
                        {bookingList
                            .filter(booking => checkedList.includes(booking.id))
                            .reduce(
                                (acc, booking) => acc + booking.totalPrice,
                                0
                            )}
                    </div>
                    {checkedList.length > 0 && (
                        <Button
                            onClick={() => {
                                setCheckedList([]);
                                setDisabledList([]);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div> */}

            {bookingList.map(booking => (
                <div onClick={() => handleClick(booking.id)} key={booking.id}>
                    <PendingCard
                        disabled={disabledList.includes(booking.id)}
                        checked={checkedList.includes(booking.id)}
                        booking={booking}
                        bookingList={bookingList}
                    />
                </div>
            ))}
        </div>
    );
}
