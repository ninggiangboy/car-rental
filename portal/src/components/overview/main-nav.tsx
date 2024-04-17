"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

type PageProps = {
  label: string;
  path: string;
};

const pages: PageProps[] = [
  {
    label: "About Us",
    path: "/about-us",
  },
];

export async function MainNav({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLElement>>) {
  const pathName = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {pages.map((page) => (
        <Link
          key={page.path}
          href={page.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathName.includes(page.path) ? "" : "text-muted-foreground",
          )}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}
