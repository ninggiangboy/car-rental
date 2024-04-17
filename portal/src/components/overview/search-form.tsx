"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { cn, createUrl } from "@/lib/utils";
import { Location, SearchParams } from "@/lib/defines";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { useDebouncedCallback } from "use-debounce";
import { fetchLocationById, searchLocations } from "@/lib/actions";

const FormSchema = z
  .object({
    location: z.string({ required_error: "Location is required" }),
    checkin: z.date({ required_error: "Pick up is required" }),
    checkout: z.date({ required_error: "Drop off is required" }),
  })
  .refine((schema) => isAfter(schema.checkout, schema.checkin), {
    message: "Drop off must be after pick up",
    path: ["checkout"],
  });

interface SearchFormProps extends React.HTMLAttributes<HTMLElement> {
  compact?: boolean;
}

export default function SearchForm({
  compact,
  ...props
}: Readonly<SearchFormProps>) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(
    undefined,
  );

  const [locations, setLocations] = useState<Location[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkin: new Date(),
      checkout: addDays(new Date(), 1),
    },
  });

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await fetchLocationById(
        searchParams.get(SearchParams.LOCATION) || undefined,
      );
      setCurrentLocation(data);
    };

    const location = searchParams.get(SearchParams.LOCATION);
    const checkin = searchParams.get(SearchParams.CHECKIN);
    const checkout = searchParams.get(SearchParams.CHECKOUT);

    if (location) form.setValue("location", location);
    if (checkin) form.setValue("checkin", new Date(checkin));
    if (checkout) form.setValue("checkout", new Date(checkout));
    fetchLocation();
    return () => {
      form.resetField("location");
      form.resetField("checkin");
      form.resetField("checkout");
    };
  }, [searchParams, form]);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const { location, checkin, checkout } = values;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(SearchParams.PAGE);
    newParams.delete(SearchParams.PER_PAGE);
    newParams.set(SearchParams.LOCATION, location.toString());
    newParams.set(SearchParams.CHECKIN, checkin.toISOString());
    newParams.set(SearchParams.CHECKOUT, checkout.toISOString());

    push(createUrl("/cars", newParams));
  }

  const fetchLocations = async (query: string) => {
    const data = await searchLocations(query);
    setLocations(data);
  };

  const handleSearch = useDebouncedCallback((query: string) => {
    form.resetField("location");
    fetchLocations(query).then();
  }, 300);

  useEffect(() => {
    const location = searchParams.get(SearchParams.LOCATION);
    const checkin = searchParams.get(SearchParams.CHECKIN);
    const checkout = searchParams.get(SearchParams.CHECKOUT);

    if (location) form.setValue("location", location);
    if (checkin) form.setValue("checkin", new Date(checkin));
    if (checkout) form.setValue("checkout", new Date(checkout));
    return () => {
      form.resetField("location");
      form.resetField("checkin");
      form.resetField("checkout");
    };
  }, [searchParams, form]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative mx-auto grid grid-cols-[1.25fr_auto_1fr_auto_1fr_auto] items-center justify-between gap-x-2 whitespace-nowrap rounded-full border border-black/10 bg-white p-2 text-black",
          compact ? "h-[58px] w-[720px]" : "h-[68px] w-[860px]",
        )}
      >
        <div className="relative">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="grid h-full w-full grid-cols-1 items-start justify-center overflow-x-hidden px-4">
                <FormLabel
                  className={cn(
                    "inline-block h-full w-full font-bold",
                    compact ? "text-xs" : "text-[13px]",
                  )}
                >
                  Location
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        aria-label="select location"
                        variant="hidden"
                        style={{ margin: "0" }}
                        className={cn(
                          "m-0 inline-block h-auto w-full truncate p-0 text-left",
                          compact ? "text-sm" : "text-[15px]",
                          !field.value
                            ? "text-neutral-500"
                            : "font-semibold text-neutral-800",
                        )}
                      >
                        {field.value
                          ? locations.length > 0
                            ? locations.find(
                                (location) => location.id === field.value,
                              )?.path
                            : currentLocation?.path
                          : "Select location"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[400px]">
                    <Command>
                      <CommandInput
                        placeholder="Search location..."
                        onInput={(e) => handleSearch(e.currentTarget.value)}
                      />
                    </Command>
                    <Command>
                      <CommandGroup heading="Suggestions">
                        {locations.map((location) => (
                          <CommandItem
                            value={location.path}
                            key={location.id}
                            onSelect={() => {
                              form.setValue("location", location.id);
                              form.clearErrors("location");
                            }}
                          >
                            <Icons.Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                location.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {location.path}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandEmpty>No place found.</CommandEmpty>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage
                  className={cn(
                    "absolute  max-w-[calc(100%-32px)] overflow-hidden text-ellipsis",
                    compact ? "top-[52px] text-xs" : "top-[62px] text-[13px]",
                  )}
                />
              </FormItem>
            )}
          />
        </div>
        <Separator
          orientation="vertical"
          decorative
          className={compact ? "h-6" : "h-8"}
        />
        <div className="relative">
          <FormField
            control={form.control}
            name="checkin"
            render={({ field }) => (
              <FormItem className="grid h-full shrink-0 grow-0 grid-cols-1 items-start justify-center px-4">
                <FormLabel
                  className={cn(
                    "inline-block h-full w-full font-bold",
                    compact ? "text-xs" : "text-[13px]",
                  )}
                >
                  Pick-up
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        style={{ margin: "0" }}
                        variant="hidden"
                        className={cn(
                          "m-0 inline-block h-auto w-full text-ellipsis p-0 text-left",
                          compact ? "text-sm" : "text-[15px]",
                          !field.value
                            ? "text-neutral-500"
                            : "font-semibold text-neutral-800",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="start">
                    <Calendar
                      style={{ padding: "0" }}
                      initialFocus
                      mode="single"
                      selected={field.value}
                      defaultMonth={field.value || new Date()}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage
                  className={cn(
                    "absolute  max-w-[calc(100%-32px)] overflow-hidden text-ellipsis",
                    compact ? "top-[52px] text-xs" : "top-[62px] text-[13px]",
                  )}
                />
              </FormItem>
            )}
          />
        </div>
        <Separator
          orientation="vertical"
          decorative
          className={compact ? "h-6" : "h-8"}
        />
        <div className="relative">
          <FormField
            control={form.control}
            name="checkout"
            render={({ field }) => (
              <FormItem className="grid h-full shrink-0 grow-0 grid-cols-1 items-start justify-center px-4">
                <FormLabel
                  className={cn(
                    "inline-block h-full w-full font-bold",
                    compact ? "text-xs" : "text-[13px]",
                  )}
                >
                  Drop-off
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        style={{ margin: "0" }}
                        variant="hidden"
                        className={cn(
                          "m-0 inline-block h-auto w-full text-ellipsis p-0 text-left",
                          compact ? "text-sm" : "text-[15px]",
                          !field.value
                            ? "text-neutral-500"
                            : "font-semibold text-neutral-800",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="start">
                    <Calendar
                      style={{ padding: "0" }}
                      initialFocus
                      mode="single"
                      selected={field.value}
                      defaultMonth={field.value || form.getValues("checkin")}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        isBefore(date, form.getValues("checkin"))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage
                  className={cn(
                    "absolute  max-w-[calc(100%+32px)] overflow-hidden text-ellipsis",
                    compact ? "top-[52px] text-xs" : "top-[62px] text-[13px]",
                  )}
                />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size={compact ? "icon" : "icon-lg"}
          className="flex shrink-0 items-center justify-center rounded-full bg-black text-white"
        >
          <span className="sr-only">Search</span>
          <Icons.MagnifyingGlass
            className={cn(
              "[stroke-width:3px]",
              compact ? "h-[14px] w-[14px]" : "h-[18px] w-[18px]",
            )}
          />
        </Button>
      </form>
    </Form>
  );
}
