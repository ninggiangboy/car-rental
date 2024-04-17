import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QrCode from './qr-code';

export function QrCodeModal({
    code,
    amount,
}: {
    code: string;
    amount: string;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-0">
                    PENDING
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <QrCode code={code} amount={amount} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
