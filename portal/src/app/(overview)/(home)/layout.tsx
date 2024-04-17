import React from "react";
import { getUserRole } from "@/lib/actions";
import { ROLE } from "@/lib/defines";

export default async function HomeLayout({
  carOwner,
  customer,
  guest,
}: Readonly<{
  carOwner: React.ReactNode;
  customer: React.ReactNode;
  guest: React.ReactNode;
}>) {
  const role = await getUserRole();
  if (role == ROLE.CAROWNER) return <>{carOwner}</>;
  if (role == ROLE.CUSTOMER) return <>{customer}</>;
  return <>{guest}</>;
}
