'use client';

import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
    addDays,
    addMinutes,
    differenceInHours,
    isAfter,
    format,
    isBefore,
    isWithinInterval,
    startOfDay,
    subDays,
} from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { bookingFormSchema } from '@/lib/form-schema';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AvailableDate,
    CarReservation,
    Profile,
    RentalInfo,
    User,
} from '@/lib/defines';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createRental, updateRental, uploadImage } from '@/lib/actions';
import { toast } from 'sonner';

export default function BookingForm({
    user,
    detailOnly = false,
    info,
    checkin,
    checkout,
    car,
    availableDate,
}: {
    user?: Profile;
    detailOnly?: boolean;
    info?: RentalInfo;
    checkin?: Date;
    checkout?: Date;
    car: CarReservation;
    availableDate: AvailableDate[];
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const canEdit = ['PENDING'].includes(info?.status || '');
    const [isDriver, setIsDriver] = useState<boolean>(!!info?.driver);
    const [updatable, setUpdatable] = useState<boolean>(!detailOnly);
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            carId: car?.id || info?.carId,
            startDate:
                (info && new Date(info.startDate)) ||
                checkin ||
                startOfDay(availableDate[0].startDate),
            endDate:
                (info && new Date(info.endDate)) ||
                checkout ||
                startOfDay(availableDate[0].endDate),
            renter: {
                name: info?.renter.name || user?.fullName || '',
                phoneNumber:
                    info?.renter.phoneNumber || user?.phoneNumber || '',
                nationalId: info?.renter.nationalId || user?.nationalId || '',
                driverLicense:
                    info?.renter.driverLicense || user?.driverLicense || '',
            },
        },
    });
    useEffect(() => {
        setIsDriver(!!info?.driver);
    }, []);
    useEffect(() => {
        if (isDriver) {
            form.setValue('driver', {
                name: info?.driver?.name || '',
                phoneNumber: info?.driver?.phoneNumber || '',
                nationalId: info?.driver?.nationalId || '',
                driverLicense: info?.driver?.driverLicense || '',
            });
        } else {
            form.unregister('driver');
        }
    }, [isDriver, form]);
    const basePrice = car?.basePrice || 0;
    const calcDays = () => {
        return (
            Math.floor(
                differenceInHours(
                    form.getValues('endDate'),
                    addMinutes(form.getValues('startDate'), 15)
                ) / 24
            ) + 1
        );
    };

    const [days, setDays] = useState<number>(calcDays());

    useEffect(() => {
        setDays(calcDays());
    }, [form.watch('startDate'), form.watch('endDate')]);

    const { push } = useRouter();
    const onSubmit = async (data: z.infer<typeof bookingFormSchema>) => {
        setIsLoading(true);
        if (info?.id) {
            await updateRental(info.id, data);
            setIsLoading(false);
            setUpdatable(false);
            push(`/reservation/${info?.id}?updated=true`);
        } else {
            const id = await createRental(data);
            setIsLoading(false);
            if (id) push(`/reservation/${id}?created=true`);
            else toast.error('Failed to create rental');
        }
    };

    const uploadFile = (file: File, formField: string) => {
        const formData = new FormData();
        formData.append('file', file);
        uploadImage(formData).then(fileUrl =>
            form.setValue(formField, fileUrl)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
                    <div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 font-bold">
                                Renter Information
                            </div>
                            <FormField
                                control={form.control}
                                name="renter.name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!updatable}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="renter.phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={!updatable}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="renter.nationalId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>National Id</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={!updatable}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="renter.driverLicense"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Driver License</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                disabled={!updatable}
                                                accept="image/*, application/pdf"
                                                onChange={e => {
                                                    if (
                                                        e.target.files &&
                                                        e.target.files.length >
                                                            0
                                                    ) {
                                                        uploadFile(
                                                            e.target.files[0],
                                                            field.name
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {field.value && (
                                            <FormDescription className="text-sm">
                                                <Link
                                                    href={field.value}
                                                    target="_black"
                                                >
                                                    Driver License Preview
                                                </Link>
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="col-span-2 flex gap-2 my-5">
                                <Checkbox
                                    id="driver"
                                    disabled={!updatable}
                                    defaultChecked={isDriver}
                                    onCheckedChange={check =>
                                        setIsDriver(
                                            typeof check === 'boolean'
                                                ? check
                                                : false
                                        )
                                    }
                                />
                                <label
                                    htmlFor="driver"
                                    className="text-sm font-medium leading-none"
                                >
                                    Driver different from renter
                                </label>
                            </div>
                            {isDriver && (
                                <>
                                    <div className="col-span-2 font-bold">
                                        Driver Information
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="driver.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!updatable}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="driver.phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        disabled={!updatable}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="driver.nationalId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    National Id
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        disabled={!updatable}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="driver.driverLicense"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Driver License
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        disabled={!updatable}
                                                        accept="image/*, application/pdf"
                                                        onChange={e => {
                                                            if (
                                                                e.target
                                                                    .files &&
                                                                e.target.files
                                                                    .length > 0
                                                            ) {
                                                                uploadFile(
                                                                    e.target
                                                                        .files[0],
                                                                    field.name
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {detailOnly && field.value && (
                                                    <FormDescription className="text-sm">
                                                        <Link
                                                            href={field.value}
                                                            target="_black"
                                                        >
                                                            Driver License
                                                            Preview
                                                        </Link>
                                                    </FormDescription>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            {/*<Button className="col-span-2 mt-5">*/}
                            {/*  {detailOnly ? "Update" : "Submit"}*/}
                            {/*</Button>*/}
                            {!detailOnly && (
                                <Button
                                    disabled={isLoading}
                                    className="col-span-2 mt-5"
                                >
                                    Submit
                                </Button>
                            )}
                            {detailOnly && updatable && (
                                <Button
                                    disabled={isLoading}
                                    className="col-span-2 mt-5"
                                >
                                    Update
                                </Button>
                            )}
                            {detailOnly && !updatable && (
                                <Button
                                    className="col-span-2 mt-5"
                                    disabled={!canEdit || isLoading}
                                    onClick={() => setUpdatable(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <div className="rounded-xl md:border md:p-6">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold">
                                    Your reservation{' '}
                                    <span>{info ? `#${info.id}` : ''}</span>
                                </h2>
                                <div className="mt-5">
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormField
                                                control={form.control}
                                                name="startDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pick up
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        disabled={
                                                                            detailOnly
                                                                        }
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'justify-start text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                'hh:mma PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pick
                                                                                a
                                                                                date
                                                                            </span>
                                                                        )}
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                align="start"
                                                                className="flex w-auto flex-col space-y-2 p-2 "
                                                            >
                                                                <Select
                                                                    onValueChange={value => {
                                                                        const newTime =
                                                                            new Date(
                                                                                value
                                                                            );
                                                                        field.onChange(
                                                                            newTime
                                                                        );
                                                                    }}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder={
                                                                                field.value
                                                                                    ? format(
                                                                                          field.value,
                                                                                          'hh:mma'
                                                                                      )
                                                                                    : 'Select time'
                                                                            }
                                                                        />
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper">
                                                                        {Array.from(
                                                                            {
                                                                                length:
                                                                                    24 *
                                                                                    2,
                                                                            }
                                                                        ).map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => {
                                                                                const newTime =
                                                                                    addMinutes(
                                                                                        startOfDay(
                                                                                            field.value
                                                                                        ),
                                                                                        i *
                                                                                            30
                                                                                    );
                                                                                const isDisabled =
                                                                                    availableDate?.some(
                                                                                        d =>
                                                                                            isAfter(
                                                                                                newTime,
                                                                                                d.startDate
                                                                                            ) &&
                                                                                            isBefore(
                                                                                                newTime,
                                                                                                d.endDate
                                                                                            )
                                                                                    );
                                                                                return (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        disabled={
                                                                                            !isDisabled
                                                                                        }
                                                                                        value={newTime.toISOString()}
                                                                                    >
                                                                                        {format(
                                                                                            newTime,
                                                                                            'hh:mma'
                                                                                        )}
                                                                                    </SelectItem>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                                <div className="rounded-md border">
                                                                    <Calendar
                                                                        mode="single"
                                                                        disabled={date => {
                                                                            return (
                                                                                addDays(
                                                                                    date,
                                                                                    1
                                                                                ) <
                                                                                    new Date() ||
                                                                                !availableDate.some(
                                                                                    d =>
                                                                                        isAfter(
                                                                                            startOfDay(
                                                                                                addDays(
                                                                                                    date,
                                                                                                    1
                                                                                                )
                                                                                            ),
                                                                                            startOfDay(
                                                                                                d.startDate
                                                                                            )
                                                                                        ) &&
                                                                                        isBefore(
                                                                                            startOfDay(
                                                                                                date
                                                                                            ),
                                                                                            startOfDay(
                                                                                                addDays(
                                                                                                    d.endDate,
                                                                                                    1
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                )
                                                                            );
                                                                        }}
                                                                        selected={
                                                                            field.value
                                                                        }
                                                                        onSelect={newTime => {
                                                                            newTime?.setHours(
                                                                                field.value?.getHours()
                                                                            );
                                                                            newTime?.setMinutes(
                                                                                field.value?.getMinutes()
                                                                            );
                                                                            newTime?.setSeconds(
                                                                                field.value?.getSeconds()
                                                                            );
                                                                            field.onChange(
                                                                                newTime
                                                                                    ? newTime
                                                                                    : field.value
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            ></FormField>
                                            <FormField
                                                control={form.control}
                                                name="endDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Drop off
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        disabled={
                                                                            detailOnly
                                                                        }
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'justify-start text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                'hh:mma PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pick
                                                                                a
                                                                                date
                                                                            </span>
                                                                        )}
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                align="start"
                                                                className="flex w-auto flex-col space-y-2 p-2 "
                                                            >
                                                                <Select
                                                                    onValueChange={value => {
                                                                        const newTime =
                                                                            new Date(
                                                                                value
                                                                            );
                                                                        field.onChange(
                                                                            newTime
                                                                        );
                                                                    }}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder={
                                                                                field.value
                                                                                    ? format(
                                                                                          field.value,
                                                                                          'hh:mma'
                                                                                      )
                                                                                    : 'Select time'
                                                                            }
                                                                        />
                                                                    </SelectTrigger>
                                                                    <SelectContent position="popper">
                                                                        {Array.from(
                                                                            {
                                                                                length:
                                                                                    24 *
                                                                                    2,
                                                                            }
                                                                        ).map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => {
                                                                                const newTime =
                                                                                    addMinutes(
                                                                                        startOfDay(
                                                                                            field.value
                                                                                        ),
                                                                                        i *
                                                                                            30
                                                                                    );
                                                                                const startDate =
                                                                                    form.getValues(
                                                                                        'startDate'
                                                                                    );
                                                                                const isDisabled =
                                                                                    isBefore(
                                                                                        newTime,
                                                                                        addMinutes(
                                                                                            startDate,
                                                                                            10
                                                                                        )
                                                                                    ) ||
                                                                                    !availableDate?.some(
                                                                                        d =>
                                                                                            isAfter(
                                                                                                newTime,
                                                                                                d.startDate
                                                                                            ) &&
                                                                                            isBefore(
                                                                                                newTime,
                                                                                                d.endDate
                                                                                            )
                                                                                    );
                                                                                return (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        disabled={
                                                                                            isDisabled
                                                                                        }
                                                                                        value={newTime.toISOString()}
                                                                                    >
                                                                                        {format(
                                                                                            newTime,
                                                                                            'hh:mma'
                                                                                        )}
                                                                                    </SelectItem>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                                <div className="rounded-md border">
                                                                    <Calendar
                                                                        mode="single"
                                                                        disabled={date => {
                                                                            const startDate =
                                                                                form.getValues(
                                                                                    'startDate'
                                                                                );
                                                                            const range =
                                                                                availableDate.find(
                                                                                    d =>
                                                                                        isAfter(
                                                                                            startDate,
                                                                                            d.startDate
                                                                                        ) &&
                                                                                        isBefore(
                                                                                            startDate,
                                                                                            d.endDate
                                                                                        )
                                                                                );
                                                                            const isInRange =
                                                                                range &&
                                                                                isWithinInterval(
                                                                                    date,
                                                                                    {
                                                                                        start: startOfDay(
                                                                                            subDays(
                                                                                                range.startDate,
                                                                                                1
                                                                                            )
                                                                                        ),
                                                                                        end: startOfDay(
                                                                                            addDays(
                                                                                                range.endDate,
                                                                                                1
                                                                                            )
                                                                                        ),
                                                                                    }
                                                                                );
                                                                            return (
                                                                                addDays(
                                                                                    date,
                                                                                    1
                                                                                ) <
                                                                                    startDate ||
                                                                                !availableDate.some(
                                                                                    d =>
                                                                                        isAfter(
                                                                                            startOfDay(
                                                                                                addDays(
                                                                                                    date,
                                                                                                    1
                                                                                                )
                                                                                            ),
                                                                                            startOfDay(
                                                                                                d.startDate
                                                                                            )
                                                                                        ) &&
                                                                                        isBefore(
                                                                                            startOfDay(
                                                                                                date
                                                                                            ),
                                                                                            startOfDay(
                                                                                                addDays(
                                                                                                    d.endDate,
                                                                                                    1
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                ) ||
                                                                                !isInRange
                                                                            );
                                                                        }}
                                                                        selected={
                                                                            field.value
                                                                        }
                                                                        onSelect={newTime => {
                                                                            newTime?.setHours(
                                                                                field.value?.getHours()
                                                                            );
                                                                            newTime?.setMinutes(
                                                                                field.value?.getMinutes()
                                                                            );
                                                                            newTime?.setSeconds(
                                                                                field.value?.getSeconds()
                                                                            );
                                                                            field.onChange(
                                                                                newTime
                                                                                    ? newTime
                                                                                    : field.value
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            ></FormField>
                                        </div>
                                    </div>
                                    <div className="mt-5 space-y-1">
                                        <FormLabel>Location</FormLabel>
                                        <p className="text-neutral-600">
                                            {car?.location}
                                        </p>
                                    </div>
                                </div>
                                <Separator
                                    orientation="horizontal"
                                    decorative
                                    className="my-6"
                                />
                            </div>
                            <div className="grid grid-cols-1 grid-rows-1 items-start justify-between">
                                <div>
                                    <p className="text-2xl font-bold">
                                        {car?.carName}
                                    </p>
                                </div>
                                <div className="flex space-x-1 text-xs items-center mt-5">
                                    <Icons.Star className="h-3 w-3" />
                                    <span className="font-semibold">
                                        {Math.round((car?.rating || 0) * 100) /
                                            100}
                                    </span>
                                    <span className="text-neutral-600">
                                        ({car?.numberOfRides} rides)
                                    </span>
                                </div>
                            </div>
                            <Separator
                                decorative
                                orientation="horizontal"
                                className="my-6"
                            />
                            <div className="hidden md:block">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Price details
                                    </h2>
                                    <p className="text-neutral-600 text-sm">
                                        You will need to pay the deposit (if
                                        any) when car owner confirm this booking
                                        and will have to pay the rental fee (and
                                        receive the deposit) after returning the
                                        car.
                                    </p>
                                    <div className="flex flex-col gap-y-3 pt-6 text-neutral-600">
                                        <div className="flex items-center justify-between">
                                            <span>
                                                {`$${basePrice}`} x{' '}
                                                {days > 0 ? days : 0} days
                                                (Postpaid)
                                            </span>
                                            <span className="font-semibold">{`$${basePrice * days > 0 ? basePrice * days : 0}`}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>
                                                Deposit (Refundable upon
                                                completion)
                                            </span>
                                            <span className="font-semibold">{`$${car?.deposit}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
