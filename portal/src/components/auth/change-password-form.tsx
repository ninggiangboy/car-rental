"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
  .object({
    token: z.string(),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((password) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(password), {
        message: "Password must contain at least 1 character and 1 number.",
      }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm({ token }: Readonly<{ token: string }>) {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await resetPassword(values.token, values.password);
    if (result) {
      push("/login");
    } else {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoFocus
                      disabled={isLoading}
                      placeholder="Your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoFocus
                      disabled={isLoading}
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isPending}>
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send request
            </Button>
            {isPending && (
              <p className="text-sm text-muted-foreground">
                You have to wait 30 seconds to resend the request
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
