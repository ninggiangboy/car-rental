import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserAnalysis from "../user-analysis";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
};

export default function HoverUserProfile({ user }: { user: User }) {
  return (
    <HoverCard>
      <Link href={`/customer-profile/${user.id}`} passHref>
        <HoverCardTrigger asChild>
          <div className="flex gap-4 items-center hover:underline">
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {user.name || "No name"}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.phoneNumber || "No phone number"}
              </p>
            </div>
          </div>
        </HoverCardTrigger>
      </Link>
      <HoverCardContent className="w-[500px] text-sm">
        <UserAnalysis userId={user.id} />
      </HoverCardContent>
    </HoverCard>
  );
}
