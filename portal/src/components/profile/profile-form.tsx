'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Profile } from '@/lib/defines';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { profileFormSchema } from '@/lib/form-schema';
import { updateProfile } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { PasswordInput } from '../ui/password-input';

export default function ProfileForm({ profile }: { profile: Profile }) {
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            email: profile.email,
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber || undefined,
            dateOfBirth: new Date(profile.dateOfBirth) || new Date(),
            nationalId: profile.nationalId || undefined,
            image: profile.image || undefined,
            driverLicense: profile.driverLicense || undefined,
            password: '',
        },
    });
    const [preview, setPreview] = useState('');
    const [previewDriver, setPreviewDriver] = useState('');
    function getImageData(event: ChangeEvent<HTMLInputElement>) {
        const dataTransfer = new DataTransfer();

        Array.from(event.target.files!).forEach(image =>
            dataTransfer.items.add(image)
        );

        const files = dataTransfer.files;
        const displayUrl = URL.createObjectURL(event.target.files![0]);

        return { files, displayUrl };
    }

    async function onSubmit(data: z.infer<typeof profileFormSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value == undefined) return;
            if (key === 'image' && typeof value === 'string') {
                return;
            }
            if (key === 'driverLicense' && typeof value === 'string') {
                return;
            }
            if (key === 'dateOfBirth') {
                formData.append(key, value.toISOString());
            } else {
                formData.append(key, value);
            }
        });
        const result = await updateProfile(formData);
        if (typeof result === 'object' && result.err) {
            setIsLoading(false);
            alert(result.err);
        } else {
            setIsLoading(false);
            if (data.email != profile.email) {
                alert('Email changed. Please sign in again!');
                push('/logout');
            } else {
                push('/profile');
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <>
                            <FormItem className="flex gap-4">
                                <Avatar className="h-[100px] w-[100px] border-[3px]">
                                    <AvatarImage
                                        className="object-cover"
                                        src={preview || form.getValues('image')}
                                        alt="avatar"
                                    />
                                    <AvatarFallback>
                                        {profile.fullName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-2 ">
                                    <FormLabel>Upload new avatar</FormLabel>
                                    <label
                                        className={buttonVariants({
                                            variant: 'outline',
                                        })}
                                        htmlFor="avatar-up"
                                    >
                                        Choose File
                                    </label>
                                </div>
                                <FormControl>
                                    <Input
                                        id="avatar-up"
                                        className="hidden"
                                        accept={'image/*'}
                                        type="file"
                                        {...rest}
                                        onChange={event => {
                                            const { files, displayUrl } =
                                                getImageData(event);
                                            setPreview(displayUrl);
                                            onChange(files[0]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </>
                    )}
                />

                <div className="grid grid-cols-2 gap-7">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl
                                    className={cn(
                                        '',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    <Input placeholder="Full Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl
                                    className={cn(
                                        '',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    <Input placeholder="Email" {...field} />
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
                                    <Input
                                        className={cn(
                                            '',
                                            !field.value &&
                                                'text-muted-foreground'
                                        )}
                                        placeholder="Your phone number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>National ID</FormLabel>
                                <FormControl
                                    className={cn(
                                        '',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    <Input
                                        placeholder="National ID"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/*<FormField*/}
                    {/*  control={form.control}*/}
                    {/*  name="dateOfBirth"*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <FormItem className="grid grid-cols-1">*/}
                    {/*      <FormLabel>Date of birth</FormLabel>*/}
                    {/*      <Popover>*/}
                    {/*        <PopoverTrigger asChild>*/}
                    {/*          <FormControl>*/}
                    {/*            <Button*/}
                    {/*              variant={"outline"}*/}
                    {/*              className={cn(*/}
                    {/*                "",*/}
                    {/*                !field.value && "text-muted-foreground",*/}
                    {/*              )}*/}
                    {/*            >*/}
                    {/*              {field.value ? (*/}
                    {/*                format(field.value, "PPP")*/}
                    {/*              ) : (*/}
                    {/*                <span>Pick a date</span>*/}
                    {/*              )}*/}
                    {/*              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />*/}
                    {/*            </Button>*/}
                    {/*          </FormControl>*/}
                    {/*        </PopoverTrigger>*/}
                    {/*        <PopoverContent className="w-auto p-0" align="start">*/}
                    {/*          <Calendar*/}
                    {/*            mode="single"*/}
                    {/*            selected={field.value}*/}
                    {/*            onSelect={field.onChange}*/}
                    {/*            disabled={(date) =>*/}
                    {/*              date > new Date() || date < new Date("1900-01-01")*/}
                    {/*            }*/}
                    {/*            initialFocus*/}
                    {/*          />*/}
                    {/*        </PopoverContent>*/}
                    {/*      </Popover>*/}
                    {/*      <FormMessage />*/}
                    {/*    </FormItem>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    <FormField
                        control={form.control}
                        name="driverLicense"
                        render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem className="col-span-2">
                                <div className="flex gap-2 items-center">
                                    <FormLabel>Driver License</FormLabel>
                                    <label
                                        className={buttonVariants({
                                            variant: 'outline',
                                        })}
                                        htmlFor="dl"
                                    >
                                        Choose File
                                    </label>
                                </div>
                                <FormControl>
                                    <Input
                                        id="dl"
                                        className="hidden"
                                        type="file"
                                        accept={'image/*'}
                                        {...rest}
                                        onChange={event => {
                                            const { files, displayUrl } =
                                                getImageData(event);
                                            setPreviewDriver(displayUrl);
                                            onChange(files[0]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                {form.getValues('driverLicense') && (
                                    <Image
                                        className="object-contain w-[400px]"
                                        src={
                                            previewDriver ||
                                            form.getValues('driverLicense')
                                        }
                                        alt="driverLicense"
                                        width={1000}
                                        height={1000}
                                    />
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter password to update</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        className={cn(
                                            '',
                                            !field.value &&
                                                'text-muted-foreground'
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading || !form.getValues('password')}
                >
                    {isLoading && (
                        <Icons.Spinner className=" mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update profile
                </Button>
            </form>
        </Form>
    );
}
