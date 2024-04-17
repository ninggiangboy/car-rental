import ProfileForm from "@/components/profile/profile-form";
import { Separator } from "@/components/ui/separator";
import { fetchUserProfile, getUser } from "@/lib/actions";

export default async function ProfilePage() {
  const profile = await fetchUserProfile();

  return (
    <div className="space-y-4 ">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
      </div>
      <Separator />
      <ProfileForm profile={profile} />
    </div>
  );
}
