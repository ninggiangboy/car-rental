import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/lib/defines';

export default function StatusBadge({ status }: { status: string }) {
    const getBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case BookingStatus.PENDING:
                return (
                    <Badge variant="pending">Waiting for confirmation</Badge>
                );
            case BookingStatus.REJECTED:
                return <Badge variant="reject">Rejected</Badge>;
            case BookingStatus.CONFIRMED:
                return <Badge variant="confirm">Confirmed</Badge>;
            case BookingStatus.CANCELLED:
                return <Badge variant="cancel">Cancelled</Badge>;
            case BookingStatus.IN_PROGRESS:
                return <Badge variant="inprogress">In progress</Badge>;
            case BookingStatus.COMPLETED:
                return <Badge variant="complete">Completed</Badge>;
            case BookingStatus.PENDING_DEPOSIT:
                return <Badge variant="pending">Waiting for deposit</Badge>;
            case BookingStatus.PENDING_CONFIRM_DEPOSIT:
                return (
                    <Badge variant="pending">
                        Wating for deposit confirmation
                    </Badge>
                );
            case BookingStatus.PENDING_PICKUP:
                return <Badge variant="pending">Wating for pickup</Badge>;
            case BookingStatus.PENDING_PAYMENT:
                return (
                    <Badge variant="pending">
                        Wating for completing payment
                    </Badge>
                );
            case BookingStatus.PENDING_CONFIRM_PAYMENT:
                return (
                    <Badge variant="pending">
                        Wating for payment confirmation
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {status.replaceAll('_', ' ')}
                    </Badge>
                );
        }
    };

    return getBadge(status);
}
