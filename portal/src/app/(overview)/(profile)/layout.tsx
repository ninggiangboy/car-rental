import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/profile/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Change Password",
    href: "/change-password",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:px-20 md:py-8 lg:px-32 lg:py-16 px-5 py-3">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
