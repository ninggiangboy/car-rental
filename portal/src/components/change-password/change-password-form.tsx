"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { changePassword, logout } from "@/lib/actions";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const { push } = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await changePassword(oldPassword, newPassword);
    if (result) {
      alert("Password changed successfully. Please sign in again!");
      push("/logout");
    } else alert("Failed to change password. Old password is incorrect!");
    setIsLoading(false);
  };
  return (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2 w-[50%]">
          <Label htmlFor="oldPassword">Old Password</Label>
          <PasswordInput
            onChange={(v) => setOldPassword(v.target.value)}
            id="oldPassword"
          />
        </div>
        <div className="grid gap-2 w-[50%]">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            onChange={(v) => setNewPassword(v.target.value)}
            id="newPassword"
          />
          {oldPassword && oldPassword == newPassword && (
            <div className="text-red-600 text-sm mt-2">
              Old and new password cannot be the same
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Button
          className="w-[50%]"
          disabled={
            !(oldPassword && newPassword) ||
            oldPassword == newPassword ||
            isLoading
          }
          onClick={handleSubmit}
        >
          {isLoading && (
            <Icons.Spinner className=" mr-2 h-4 w-4 animate-spin" />
          )}
          Change
        </Button>
      </div>
    </div>
  );
}
