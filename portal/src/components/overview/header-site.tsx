import LogoSite from "@/components/overview/logo-site";
import { UserNav } from "@/components/overview/user-nav";
import { MainNav } from "@/components/overview/main-nav";

export default function HeaderSite() {
  return (
    <div className="md:px-12 text-lg border-b sticky z-[40] top-0 w-full bg-[hsla(0,0%,100%,.8)] shadow-[inset_0_-1px_0_0_#eaeaea] backdrop-blur-[5px] backdrop-saturate-[1.8]">
      <div className="flex h-14 items-center px-4 relative">
        <LogoSite />
        <div className="ml-auto flex items-center space-x-4">
          <MainNav className="mx-6 hidden sm:flex" />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
