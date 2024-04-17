"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { createUrl } from "@/lib/utils";

export default function ToggleView() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { push } = useRouter();
  const mode = searchParams.get("mode") || "grid";
  const handleClick = () => {
    const newMode = mode == "grid" ? "thumbnail" : "grid";
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("mode", newMode);
    push(createUrl(pathName, newSearchParams));
  };
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={mode == "thumbnail"}
        onClick={handleClick}
        id="view-mode"
      />
      <Label htmlFor="view-mode">Thumbnail View</Label>
    </div>
  );
}
