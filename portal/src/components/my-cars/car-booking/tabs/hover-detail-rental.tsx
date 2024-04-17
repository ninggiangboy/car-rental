import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import DetailRental from './detail-rental';
import { Renter } from '@/lib/defines';

export default function HoverDetailRental({
    renter,
    driver,
}: {
    renter: Renter;
    driver: Renter;
}) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button
                    variant="secondary"
                    className="px-3 shadow-none hover:underline"
                >
                    Detail
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[27rem]">
                <DetailRental renter={renter} driver={driver} />
            </HoverCardContent>
        </HoverCard>
    );
}
