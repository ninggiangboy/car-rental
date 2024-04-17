import {
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyTokenEmail } from "@/lib/actions";

export default async function VerifyPage({
  searchParams,
}: Readonly<{ searchParams: { token?: string } }>) {
  const result = await verifyTokenEmail(searchParams?.token);
  if (searchParams.token && result) {
    return (
      <Alert>
        <EnvelopeClosedIcon className="h-4 w-4" />
        <AlertTitle>Congratulations</AlertTitle>
        <AlertDescription>Your email has been confirmed</AlertDescription>
      </Alert>
    );
  } else
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Link is invalid or has expired.</AlertDescription>
      </Alert>
    );
}
