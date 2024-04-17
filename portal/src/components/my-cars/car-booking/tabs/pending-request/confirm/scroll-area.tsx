import { BookingListRecord } from '@/lib/defines';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import RejectCard from './reject-card';

export default function ScrollBookingArea({
    bookingList,
}: {
    bookingList: BookingListRecord[];
}) {
    return (
        <ScrollArea className="h-96">
            <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                    {bookingList.map(booking => (
                        <div key={booking.id}>
                            <RejectCard booking={booking} />
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}
