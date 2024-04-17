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
      <div className="md:px-36 md:py-8 lg:px-48 lg:py-16 px-5 py-3">
        <div className="space-y-0.5 mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Customer Profile
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
