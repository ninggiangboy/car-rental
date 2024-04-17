import { z } from 'zod';
import { isAfter, isBefore } from 'date-fns';
import { fetchAvailableDate } from '@/lib/actions';

export const loginFormSchema = z.object({
    email: z.string().email({ message: 'Email must be a valid email.' }),
    password: z
        .string()
        .min(4, { message: 'Password must be at least 8 characters.' }),
});

export const signUpFormSchema = z.object({
    name: z
        .string({ required_error: 'Full name is required.' })
        .min(3, { message: 'Name must be at least 3 characters.' })
        .max(50, { message: 'Name must be at most 50 characters.' }),
    email: z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Email must be a valid email.' }),
    phoneNumber: z
        .string({ required_error: 'Phone number is required.' })
        .min(10, { message: 'Phone number must be at least 10 characters.' }),
    role: z.enum(['customer', 'car-owner'], {
        required_error: 'Role is required.',
    }),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' })
        .refine(password => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(password), {
            message: 'Password must contain at least 1 character and 1 number.',
        }),
    term: z
        .boolean({ required_error: 'You must agree to the terms.' })
        .refine(data => data === true, {
            message: 'You must agree to the terms.',
        }),
});

export const bookingFormSchema = z
    .object({
        carId: z.number(),
        startDate: z.date({ required_error: 'Check in is required' }),
        endDate: z.date({ required_error: 'Check out is required' }),
        renter: z.object({
            name: z
                .string({ required_error: 'Name is required' })
                .min(3, { message: 'Name must be at least 3 characters.' }),
            phoneNumber: z
                .string({ required_error: 'Phone number is required' })
                .min(10, {
                    message: 'Phone number must be at least 10 characters.',
                }),
            nationalId: z
                .string({ required_error: 'National ID is required' })
                .min(10, {
                    message: 'National ID must be at least 10 characters.',
                }),
            driverLicense: z.any(),
        }),
        driver: z
            .object({
                name: z
                    .string({ required_error: 'Name is required' })
                    .min(3, { message: 'Name must be at least 3 characters.' }),
                phoneNumber: z
                    .string({ required_error: 'Phone number is required' })
                    .min(10, {
                        message: 'Phone number must be at least 10 characters.',
                    }),
                nationalId: z
                    .string({ required_error: 'National ID is required' })
                    .min(10, {
                        message: 'National ID must be at least 10 characters.',
                    }),
                driverLicense: z.any(),
            })
            .optional(),
    })
    .nonstrict()
    .refine(schema => isAfter(schema.startDate, new Date()), {
        message: 'Pick up must be after now',
        path: ['startDate'],
    })
    .refine(schema => isAfter(schema.endDate, schema.startDate), {
        message: 'Drop off must be after check in',
        path: ['endDate'],
    })
    .refine(
        async schema => {
            const availableDates = await fetchAvailableDate(schema.carId);
            return availableDates.some(
                d =>
                    isAfter(schema.startDate, d.startDate) &&
                    isBefore(schema.endDate, d.endDate)
            );
        },
        {
            message:
                'The car is not available for the selected date. Please select another date.',
            path: ['startDate'],
        }
    )
    .refine(
        schema => {
            if (schema.driver) {
                return schema.driver.driverLicense;
            }
            return true;
        },
        {
            message: 'Driver license is required',
            path: ['driver', 'driverLicense'],
        }
    )
    .refine(
        schema => {
            if (!schema.driver) {
                return schema.renter.driverLicense;
            }
            return true;
        },
        {
            message: 'Driver license is required',
            path: ['renter', 'driverLicense'],
        }
    );

export const profileFormSchema = z.object({
    fullName: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        }),
    email: z
        .string({
            required_error: 'Please input an email.',
        })
        .email(),
    image: z.any().optional(),
    driverLicense: z.any().optional(),
    dateOfBirth: z
        .date({
            required_error: 'A date of birth is required.',
        })
        .optional(),
    phoneNumber: z
        .string()
        .max(20)
        .min(4)
        .regex(/^\d+$/, {
            message: 'Phone number must contain only digits.',
        })
        .optional(),
    nationalId: z
        .string()
        .max(22)
        .regex(/^\d+$/, {
            message: 'ID must contain only digits.',
        })
        .optional(),
    password: z.string(),
});
