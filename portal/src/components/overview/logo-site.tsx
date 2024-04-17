import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function LogoSite() {
  return (
    <Link href="/" className="mr-6 sm:flex items-center space-x-2">
      <Icons.Logo className="h-6 w-6" />
      <span className="font-bold hidden sm:inline-block">
        {siteConfig.name}
      </span>
    </Link>
  );
}
