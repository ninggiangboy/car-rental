import {
    EnvelopeClosedIcon,
    ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { confirmTrans } from '@/lib/actions';

export default async function ConfirmPage({
    searchParams,
}: Readonly<{ searchParams: { code?: string } }>) {
    const result = await confirmTrans(searchParams?.code);
    if (searchParams.code && result) {
        return (
            <Alert>
                <EnvelopeClosedIcon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Confirm payment success</AlertDescription>
            </Alert>
        );
    } else
        return (
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Link is invalid or has expired.
                </AlertDescription>
            </Alert>
        );
}
