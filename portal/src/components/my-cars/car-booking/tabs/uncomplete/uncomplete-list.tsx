import { BookingListRecord } from '@/lib/defines';
import UncompleteCard from './uncomplete-card';

export default function UncompleteList({
    bookingList,
}: {
    bookingList: BookingListRecord[];
}) {
    return (
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {bookingList.map(booking => (
                <div key={booking.id}>
                    <UncompleteCard booking={booking} />
                </div>
            ))}
        </div>
    );
}
