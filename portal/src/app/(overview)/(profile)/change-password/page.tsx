import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/actions";
import { ChangePasswordForm } from "@/components/change-password/change-password-form";

export default async function ProfilePage() {
  const user = await getUser();
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-medium">Change Password</h3>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
  );
}
