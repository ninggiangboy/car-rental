"use client";
import {
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signUpFormSchema } from "@/lib/form-schema";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { register } from "@/lib/actions";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthSignUpForm({ className, ...props }: UserAuthFormProps) {
  const { push } = useRouter();
  const [signUpResult, setsignUpResult] = React.useState<
    { error?: string } | undefined
  >(undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const success = searchParams.get("success");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  const handleSignUpEmail = async (
    values: z.infer<typeof signUpFormSchema>,
  ) => {
    setIsLoading(true);
    const data = await register(values);
    if (typeof data === "object" && data.error) {
      toast.error(data.error, { duration: 3000 });
    } else {
      push("/signup?success=true");
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <Alert>
        <EnvelopeClosedIcon className="h-4 w-4" />
        <AlertTitle>Congratulations</AlertTitle>
        <AlertDescription>
          Account created successfully, check your email to verify
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {signUpResult?.error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{signUpResult?.error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUpEmail)}
          className="space-y-8"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      disabled={isLoading}
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
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
                  </div>
                  <FormControl>
                    <PasswordInput disabled={isLoading} {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters and contain at least
                    1 character and 1 number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              defaultValue="customer"
              render={({ field }) => (
                <FormItem className="my-5">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? "customer"}
                      className="grid grid-cols-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="customer" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I want to rent a car
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="car-owner" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I am a car owner
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Agree with the{" "}
                      <Link
                        className="hover:underline underline-offset-4 text-black"
                        href={""}
                      >
                        terms and conditions
                      </Link>
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="mt-5">
              {isLoading && (
                <Icons.Spinner className=" mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up Now
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
