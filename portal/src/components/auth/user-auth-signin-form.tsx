"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { loginFormSchema } from "@/lib/form-schema";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthSignInForm({ className, ...props }: UserAuthFormProps) {
  const { push } = useRouter();
  const [loginResult, setLoginResult] = React.useState<
    { error?: string } | undefined
  >(undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignInEmail = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    const result = await login(values);
    setIsLoading(false);
    if (result?.error) {
      setLoginResult(result);
    } else {
      push(callbackUrl ?? "/");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {loginResult?.error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{loginResult?.error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignInEmail)}
          className="space-y-8"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      disabled={isLoading}
                      placeholder="name@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <FormDescription className="items-start">
                      <Link
                        href={"/forgot-password"}
                        className="underline-offset-4 hover:underline hover:text-primary h-full"
                      >
                        Forgot password?
                      </Link>
                    </FormDescription>
                  </div>
                  <FormControl>
                    <PasswordInput disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="mt-5">
              {isLoading && (
                <Icons.Spinner className=" mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in with Email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
