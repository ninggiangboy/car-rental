import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyTokenResetPassword } from "@/lib/actions";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default async function VerifyPage({
  searchParams,
}: Readonly<{ searchParams: { token?: string } }>) {
  const result = await verifyTokenResetPassword(searchParams?.token);
  
  if (searchParams.token && result) {
    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
        </div>
        <ChangePasswordForm token={searchParams.token} />
      </>
    );
  }
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Link is invalid or has expired.</AlertDescription>
    </Alert>
  );
}
