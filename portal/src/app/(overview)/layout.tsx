import HeaderSite from "@/components/overview/header-site";
import React from "react";
import FooterSite from "@/components/overview/home/footer-site";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderSite />
      <div className="bg-background scroll-smooth">
        <main>{children}</main>
      </div>
      <FooterSite />
    </>
  );
}
