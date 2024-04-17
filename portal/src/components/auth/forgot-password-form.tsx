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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPassword } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CheckCircleIcon } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email." }),
});

export function ForgotPasswordForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<boolean | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function sendRequestEmail(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = (await forgotPassword(values.email)) || {
      error: undefined,
    };
    if (error) {
      setResult(false);
    } else {
      setResult(true);
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
      }, 30000);
    }
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {result != undefined && (
        <Alert variant={result ? "default" : "destructive"}>
          {result ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <ExclamationTriangleIcon className="h-4 w-4" />
          )}
          <AlertTitle>{result ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {result
              ? "Check your mail."
              : "Not found the user with this email."}
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(sendRequestEmail)}
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
                      placeholder="Your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isPending}>
              {isLoading && (
                <Icons.Spinner className=" mr-2 h-4 w-4 animate-spin" />
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
