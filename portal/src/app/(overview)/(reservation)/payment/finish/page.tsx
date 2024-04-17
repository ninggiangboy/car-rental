import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircledIcon } from '@radix-ui/react-icons';

export default function FinishPage({
    searchParams,
}: {
    searchParams: { method: string };
}) {
    return (
        <div className="flex justify-center w-full my-32">
            <Alert className="w-[500px]">
                <CheckCircledIcon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    {searchParams.method === 'WALLET'
                        ? 'Your payment has been successfully processed.'
                        : 'You now can self trade to and wait to car owner confirm the payment.'}
                </AlertDescription>
            </Alert>
        </div>
    );
}
