import React from "react";
import { UserAuthSignUpForm } from "@/components/auth/user-auth-signup-form";

export default function SignUpPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        {/*<p className="text-sm text-muted-foreground">*/}
        {/*  Enter your email and password below to access your account*/}
        {/*</p>*/}
      </div>
      <UserAuthSignUpForm />
    </>
  );
}
