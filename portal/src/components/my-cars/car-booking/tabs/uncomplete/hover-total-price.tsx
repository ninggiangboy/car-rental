import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import TransactionTable from '../report/transaction-table';

const HoverTotalPrice = ({
    price,
    rentalId,
}: {
    price: number;
    rentalId: number;
}) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div>
                    <Button
                        variant="hidden"
                        className="p-0 h-[1.5rem] gap-3 text-slate-500 hover:text-black "
                    >
                        <span>Total price:</span>
                        <span className="text-xl font-extrabold">${price}</span>
                    </Button>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-[35rem]">
                <div className="flex justify-between space-x-4">
                    <TransactionTable rentalId={rentalId} status={true} />
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};
export default HoverTotalPrice;
