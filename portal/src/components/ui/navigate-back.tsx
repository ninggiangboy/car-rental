"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

export function NavigateBack() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={() => router.back()}
    >
      <Icons.ChevronBack className="h-5 w-5" />
    </Button>
  );
}
