"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions";
import { useEffect } from "react";

export default function LogoutPage() {
  const route = useRouter();
  useEffect(() => {
    logout().then(() => route.push("/"));
  }, [route]);
  return <>Logging out...</>;
}
