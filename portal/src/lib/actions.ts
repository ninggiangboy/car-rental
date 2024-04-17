'use server';

import axios, { AxiosError } from 'axios';
import {
    AuthResponse,
    AvailableDate,
    Bank,
    Booking,
    BookingListRecord,
    Car,
    CarDetailInfo,
    CarOwner,
    CarReservation,
    CustomerProfile,
    FeatureLocations,
    Location,
    PageMeta,
    PendingTransaction,
    Profile,
    Rating,
    RecentRent,
    RentalInfo,
    Revenue,
    ROLE,
    SearchCarParams,
    Transaction,
    User,
    UserRentalInfo,
    WalletInfo,
} from '@/lib/defines';
import {
    bookingFormSchema,
    loginFormSchema,
    profileFormSchema,
    signUpFormSchema,
} from '@/lib/form-schema';
import { z } from 'zod';
import { cookies } from 'next/headers';

axios.defaults.baseURL = process.env.API_URL;
const maxAgeRefreshToken = 60 * 60 * 24 * 30;

export async function login(values: z.infer<typeof loginFormSchema>) {
    try {
        const data = await axios
            .post('/auth/login', {
                email: values.email,
                password: values.password,
            })
            .then(res => {
                return res.data.result.data as AuthResponse;
            })
            .catch(err => {
                const message = err.response?.data?.message;
                let errorMessages = message;
                if (message == 'Bad credentials') {
                    errorMessages = 'Invalid email or password';
                }
                if (message == 'User is disabled') {
                    errorMessages =
                        'Please verify your email to activate your account. Or sign up again with this email.';
                }
                if (message == 'User account is locked') {
                    errorMessages =
                        'Your account has been locked. Please contact support.';
                }
                throw new Error(errorMessages);
            });
        if (data) {
            let payload = atob(data.accessToken.split('.')[1]);
            const cookie = cookies();
            // TODO: reset max-age for cookies
            const user = JSON.parse(payload) as User;
            cookie.set('refreshToken', data.refreshToken, {
                maxAge: maxAgeRefreshToken,
            });
            let expiryDate = new Date(user.exp * 1000);
            cookie.set('accessToken', data.accessToken, {
                expires: expiryDate,
            });
            cookie.set('user', payload, { maxAge: maxAgeRefreshToken });
        } else {
            return data;
        }
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }
}

export async function getUser() {
    const user = cookies().get('user');
    return user ? (JSON.parse(user.value) as User) : null;
}

export async function logout() {
    const headers = await getAuthHeader();
    const token = cookies().get('refreshToken')?.value;
    if (token) {
        await axios
            .delete('/auth/logout', {
                params: { refreshToken: token },
                headers: headers,
            })
            .catch(err => {
                console.log(err.response.data);
            });
        cookies().delete('refreshToken');
        cookies().delete('accessToken');
        cookies().delete('user');
    }
}

export async function refreshAccessToken(token: string) {
    return await axios
        .post(`/auth/refresh?refreshToken=${token}`)
        .then(res => res.data.result.data as AuthResponse);
}

export async function getAuthHeader() {
    let oldAccessToken = cookies().get('accessToken')?.value;
    let oldRefreshToken = cookies().get('refreshToken')?.value;
    let accessToken = oldAccessToken;
    if (!oldAccessToken && oldRefreshToken) {
        try {
            console.log('re ' + oldRefreshToken);
            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = await refreshAccessToken(oldRefreshToken);
            let payload = atob(newAccessToken.split('.')[1]);
            const user = JSON.parse(payload) as User;
            cookies().set('refreshToken', newRefreshToken, {
                maxAge: maxAgeRefreshToken,
            });
            accessToken = newAccessToken;
            let expiryDate = new Date(user.exp * 1000);
            cookies().set('accessToken', newAccessToken, {
                expires: expiryDate,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
            }
        }
    }
    if (accessToken) {
        return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
}

export async function getUserRole() {
    const user = await getUser();
    return user
        ? ROLE[user.role.toUpperCase() as keyof typeof ROLE]
        : ROLE.GUEST;
}

export async function register(values: z.infer<typeof signUpFormSchema>) {
    const data = await axios
        .post('/register', {
            email: values.email,
            password: values.password,
            fullName: values.name,
            phoneNumber: values.phoneNumber,
            roleId: values.role === 'customer' ? 1 : 2,
        })
        .then(res => {
            return true;
        })
        .catch(err => {
            return { error: err.response?.data?.message as string };
        });
    return data;
}

export async function forgotPassword(email: string) {
    return axios
        .post(
            '/users/forgot-password',
            { email: email },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(res => {})
        .catch(err => {
            return { error: err.response?.data?.message as string };
        });
}

export async function verifyTokenResetPassword(token?: string) {
    if (!token) return false;
    return axios
        .get('/users/reset-password/verify', { params: { token: token } })
        .then(() => true)
        .catch(() => false);
}

export async function resetPassword(token: string, password: string) {
    if (!token) return false;
    return axios
        .patch(`/users/reset-password?token=${token}&newPassword=${password}`)
        .then(() => true)
        .catch(err => {
            return false;
        });
}

export async function verifyTokenEmail(token?: string) {
    if (!token) return false;
    {
        return axios
            .put(`/users/verify?token=${token}`)
            .then(() => true)
            .catch(() => false);
    }
}

export async function searchLocations(query: string) {
    if (!query) return [];
    return await axios
        .get('/locations/search', { params: { name: query } })
        .then(res => {
            return res.data.result.data as Location[];
        })
        .catch(err => {
            return [];
        });
}

export async function fetchLocationById(id?: string) {
    if (!id) return undefined;
    return await axios
        .get(`/locations/${id}`)
        .then(res => {
            return res.data.result.data as Location;
        })
        .catch(() => {
            return undefined;
        });
}

const featuredLocations = [
    {
        id: '01',
        imageUrl: '/locations/ha-noi.png',
        name: 'Thành phố Hà Nội',
        numberOfCars: 1000,
        minPrice: 40,
    },
    {
        id: '48',
        imageUrl: '/locations/da-nang.png',
        name: 'Thành phố Đà Nẵng',
        numberOfCars: 0,
        minPrice: 30,
    },
    {
        id: '79',
        imageUrl: '/locations/ho-chi-minh.png',
        name: 'Thành phố Hồ Chí Minh',
        numberOfCars: 0,
        minPrice: 30,
    },
    {
        id: '"568"',
        imageUrl: '/locations/nha-trang.png',
        name: 'Thành phố Nha Trang',
        numberOfCars: 0,
        minPrice: 30,
    },
] as FeatureLocations[];

export async function fetchFeaturedLocations() {
    try {
        return featuredLocations as FeatureLocations[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch featured locations data.');
    }
}

const pageMetaDefault = {
    totalPages: 0,
    page: 0,
    pageSize: 0,
    hasNext: false,
    hasPrev: false,
} as PageMeta;

export async function fetchCarList(searchParams: SearchCarParams) {
    try {
        const { cars, pageMeta } = await axios
            .get('/cars', { params: searchParams })
            .then(res => {
                return {
                    cars: res.data.result.data as Car[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                return { cars: [] as Car[], pageMeta: pageMetaDefault };
            });
        cars.forEach(car => {
            car.carName = car.brandName + ' ' + car.modelName + ' ' + car.year;
        });
        return { cars, pageMeta };
    } catch (error) {
        return { cars: [] as Car[], pageMeta: pageMetaDefault };
    }
}

export async function fetchCarDetails(id: number) {
    try {
        const car = await axios.get(`/cars/${id}`).then(res => {
            return res.data.result.data as CarReservation;
        });
        car.carName = car.brandName + ' ' + car.modelName + ' ' + car.year;
        return car;
    } catch (error) {
        return undefined;
    }
}

export const fetchAvailableDate = async (id: number) => {
    try {
        return await axios
            .get(`/cars/${id}/available-dates`)
            .then(res => res.data.result.data as AvailableDate[]);
    } catch (error) {
        return [];
    }
};

export const fetchRentalInfo = async (id: number) => {
    try {
        return await axios
            .get(`/rentals/${id}`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as RentalInfo);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
        }
        return undefined;
    }
};

export async function createRental(values: z.infer<typeof bookingFormSchema>) {
    console.log(values);
    return await axios
        .post('/rentals', values, {
            headers: await getAuthHeader(),
        })
        .then(res => res.data.result.data as number)
        .catch(err => {
            console.log(err.response.data);
            return undefined;
        });
}

export async function updateRental(
    id: number,
    values: z.infer<typeof bookingFormSchema>
) {
    await axios
        .put(`/rentals/${id}/edit`, values, {
            headers: await getAuthHeader(),
        })
        .catch(err => {
            console.log(err.response.data);
        });
}

export async function fetchUserBalance() {
    try {
        return await axios
            .get('/wallets/balance', {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as number);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
        }
        return 0;
    }
}

export async function payDeposit(id: number, method: string) {
    return await axios
        .get(`rentals/${id}/deposit`, {
            params: { paymentMethod: method },
            headers: await getAuthHeader(),
        })
        .then(() => true)
        .catch(err => {
            console.log(err.response.data);
            return false;
        });
}

export async function payRent(id: number, method: string) {
    return await axios
        .get(`rentals/${id}/pay-rent`, {
            params: { paymentMethod: method },
            headers: await getAuthHeader(),
        })
        .then(() => true)
        .catch(err => {
            console.log(err.response.data);
            return false;
        });
}

export async function uploadImage(formData: FormData) {
    return await axios
        .post('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...((await getAuthHeader()) as Record<string, string>),
            },
        })
        .then(res => res.data.result.data as string)
        .catch(err => {
            console.log(err.response.data);
            return '';
        });
}

export async function fetchCarDetailById(id: string) {
    // await new Promise(resolve => setTimeout(resolve, 3000));
    const car = await axios
        .get(`/cars/${id}`)
        .then(res => {
            return res.data.result.data as CarDetailInfo;
        })
        .catch(() => {
            return null;
        });
    if (!car) return null;
    return car;
}

export async function fetchCarOwnerById(id: string) {
    return await axios
        .get(`/car-owners/info/${id}`)
        .then(res => {
            return res.data.result.data as CarOwner;
        })
        .catch(() => {
            return null;
        });
}

export async function fetchRelatedCarsByCarId(id: number) {
    try {
        const cars = await axios
            .get(`cars/${id}/related-cars`)
            .then(res => {
                return res.data.result.data as Car[];
            })
            .catch(() => {
                return [] as Car[];
            });
        cars.forEach(car => {
            car.carName = car.brandName + ' ' + car.modelName + ' ' + car.year;
        });
        return cars;
    } catch (error) {
        return [] as Car[];
    }
}

export async function fetchBookingHistory(
    page?: number,
    perPage?: number,
    status?: string,
    sort?: string
) {
    try {
        const { bookings, pageMeta } = await axios
            .get('/rentals', {
                params: { page, perPage, status, sort },
                headers: await getAuthHeader(),
            })
            .then(res => {
                return {
                    bookings: res.data.result.data as Booking[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                return {
                    bookings: [] as Booking[],
                    pageMeta: pageMetaDefault,
                    error: err.response?.data,
                };
            });
        return { bookings, pageMeta };
    } catch (error) {
        return { bookings: [] as Booking[], pageMeta: pageMetaDefault };
    }
}

export async function cancelBooking(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/cancel`, { headers: await getAuthHeader() })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function giveRating(id: number, rating: number, comment: string) {
    try {
        return await axios
            .get(`/rentals/${id}/ratings?rate=${rating}&comment=${comment}`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function fetchRatingByCarId(
    id: number,
    page: number,
    perPage: number
) {
    try {
        const { ratings, pageMeta } = await axios
            .get(`cars/${id}/ratings`, { params: { page, perPage } })
            .then(res => {
                return {
                    ratings: res.data.result.data as Rating[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                console.log(err.response.data);
                return { ratings: [] as Rating[], pageMeta: pageMetaDefault };
            });
        return { ratings, pageMeta };
    } catch (error) {
        return { ratings: [] as Rating[], pageMeta: pageMetaDefault };
    }
}

export async function topUp(amount: string) {
    const value = Number(amount.replace(/\D/g, ''));

    try {
        return await axios
            .get(`/wallets/top-up?amount=${value}`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as string)
            .catch(err => {
                console.log(err.response.data);
                return '';
            });
    } catch (error) {
        return '';
    }
}

export async function withdraw(
    amount: string,
    bank: string,
    bankCode: string,
    bankNumber: string
) {
    const value = Number(amount.replace(/\D/g, ''));
    try {
        return await axios
            .get(
                `/wallets/withdraw?amount=${value}&bank=${bank}&bankCode=${bankCode}&bankNumber=${bankNumber}`,
                {
                    headers: await getAuthHeader(),
                }
            )
            .then(data => {
                return { isSuccess: true, message: 'Withdraw success' };
            })
            .catch(err => {
                console.log(err.response.data.message);
                return { isSuccess: false, message: err.response.data.message };
            });
    } catch (error) {
        return { isSuccess: false, message: 'Withdraw failed' };
    }
}

export async function fetchTransactionsHistory(
    page: number,
    perPage: number,
    start?: string,
    end?: string
) {
    try {
        const { transactions, pageMeta } = await axios
            .get(`/wallets/transactions-history`, {
                params: { page, perPage, start, end },
                headers: await getAuthHeader(),
            })
            .then(res => {
                return {
                    transactions: res.data.result.data as Transaction[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                console.log(err.response.data);
                return {
                    transactions: [] as Transaction[],
                    pageMeta: pageMetaDefault,
                };
            });
        return { transactions, pageMeta };
    } catch (error) {
        return { transactions: [] as Transaction[], pageMeta: pageMetaDefault };
    }
}

export async function fetchPendingTransaction() {
    try {
        return await axios
            .get('/wallets/pending', {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as PendingTransaction);
    } catch (error) {
        return { pendingReceive: 0, pendingPayment: 0 };
    }
}

export async function fetchWalletInfo() {
    try {
        return await axios
            .get('/wallets/info', {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as WalletInfo);
    } catch (error) {
        return {} as WalletInfo;
    }
}

export async function fetchBookingListRecord(
    carId: number,
    page: number,
    rating?: string,
    status?: string,
    perPage?: number
) {
    await wait(1000);
    try {
        const { bookingList, pageMeta } = await axios
            .get(`car-owners/cars/${carId}/bookings`, {
                params: { page, rating, status, perPage },
                headers: await getAuthHeader(),
            })
            .then(res => {
                return {
                    bookingList: res.data.result.data as BookingListRecord[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                console.log(err.response.data);
                return {
                    bookingList: [] as BookingListRecord[],
                    pageMeta: pageMetaDefault,
                };
            });
        return { bookingList, pageMeta };
    } catch (error) {
        return {
            bookingList: [] as BookingListRecord[],
            pageMeta: pageMetaDefault,
        };
    }
}

export async function fetchCarOwnerRevenue() {
    try {
        return await axios
            .get('/car-owners/cars/revenue', {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as Revenue);
    } catch (error) {
        return {} as Revenue;
    }
}

export async function fetchCarRevenue(id: number) {
    await wait(1000);
    try {
        return await axios
            .get(`/car-owners/cars/${id}/revenue`, {
                headers: await getAuthHeader(),
            })
            .then(res => {
                return res.data.result.data as Revenue;
            });
    } catch (error) {
        return {
            monthRevenue: {
                currentMonthRevenue: 0,
                previousMonthRevenue: 0,
                growthRevenueRate: 0,
            },
            totalRevenue: 0,
            avgRating: 0,
            totalRides: 0,
        } as Revenue;
    }
}

export async function fetchCarsRevenue() {
    await wait(1000);
    try {
        return await axios
            .get('/car-owners/cars/revenue', {
                headers: await getAuthHeader(),
            })
            .then(res => {
                return res.data.result.data as Revenue;
            });
    } catch (error) {
        return {
            monthRevenue: {
                currentMonthRevenue: 0,
                previousMonthRevenue: 0,
                growthRevenueRate: 0,
            },
            totalRevenue: 0,
            avgRating: 0,
            totalRides: 0,
        } as Revenue;
    }
}
export async function fetchUserRentalInfo(userId: string) {
    try {
        return await axios
            .get(`/customers/${userId}/statistic`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as UserRentalInfo);
    } catch (error) {
        return {} as UserRentalInfo;
    }
}

export async function rejectBooking(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/reject`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function pickup(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/pick-up`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function confirmPayment(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/complete`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function confirmBooking(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/confirm-rental`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function returnCar(id: number) {
    try {
        return await axios
            .get(`/rentals/${id}/return`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function fetchRejectBookingId(bookingId: number) {
    try {
        return await axios
            .get(`/rentals/${bookingId}/reject-list`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as number[]);
    } catch (error) {
        return [] as number[];
    }

    // return [2265, 2314, 2487, 3674, 4119, 5002, 5003];
}

export async function fetchRentalTransactionHistory(rentalId: number) {
    await wait(1000);
    try {
        return await axios
            .get(`/rentals/${rentalId}/transactions`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as Transaction[]);
    } catch (error) {
        return [] as Transaction[];
    }
}

export async function fetchQrCode(amount: string, trCode: string) {
    const qrCodeGenerate = process.env.BANK_QR_CODE;
    return `${qrCodeGenerate}?&amount=${Number(amount.replace(/\D/g, ''))}&addInfo=topup-${trCode}`;
}

export async function fetchBankList() {
    try {
        return await axios
            .get('https://api.vietqr.io/v2/banks')
            .then(res => res.data.data as Bank[])
            .catch(err => [] as Bank[]);
    } catch (error) {
        return [] as Bank[];
    }
}

// Demo purpose
export async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchMyCarList(searchParams: SearchCarParams) {
    try {
        const { cars, pageMeta } = await axios
            .get('/car-owners/cars', {
                params: searchParams,
                headers: await getAuthHeader(),
            })
            .then(res => {
                return {
                    cars: res.data.result.data as Car[],
                    pageMeta: res.data.result.pageMeta as PageMeta,
                };
            })
            .catch(err => {
                return { cars: [] as Car[], pageMeta: pageMetaDefault };
            });
        cars.forEach(car => {
            car.carName = car.brandName + ' ' + car.modelName + ' ' + car.year;
        });
        return { cars, pageMeta };
    } catch (error) {
        return { cars: [] as Car[], pageMeta: pageMetaDefault };
    }
}

export async function changeStatus(id: number, status: string) {
    try {
        return await axios
            .get(`/car-owners/cars/${id}/change-status`, {
                headers: await getAuthHeader(),
            })
            .then(() => true)
            .catch(err => {
                console.log(err.response.data);
                return false;
            });
    } catch (error) {
        return false;
    }
}

export async function fetchUserProfile() {
    try {
        return await axios
            .get('/users/profile', {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as Profile);
    } catch (error) {
        return {} as Profile;
    }
}

export async function updateProfile(formData: FormData) {
    await wait(1000);
    return await axios
        .post('/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...((await getAuthHeader()) as Record<string, string>),
            },
        })
        .then(() => true)
        .catch(err => {
            return { err: err.response.data.message };
        });
}

export async function changePassword(oldPassword: string, newPassword: string) {
    return await axios
        .get(
            `/users/change-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
            {
                headers: await getAuthHeader(),
            }
        )
        .then(() => true)
        .catch(err => {
            console.log(err.response.data);
            return false;
        });
}

export async function fetchCustomerProfile(id: string) {
    try {
        return await axios
            .get(`/customers/${id}/profile`, {
                headers: await getAuthHeader(),
            })
            .then(res => res.data.result.data as CustomerProfile);
    } catch (error) {
        return {} as CustomerProfile;
    }
}

export async function fetchCarsBooked(id: string) {
    try {
        const cars = await axios
            .get(`/customers/${id}/cars-booked`, {
                headers: await getAuthHeader(),
            })
            .then(res => {
                return res.data.result.data as Car[];
            })
            .catch(err => {
                return [] as Car[];
            });
        cars.forEach(car => {
            car.carName = car.brandName + ' ' + car.modelName + ' ' + car.year;
        });
        return cars;
    } catch (error) {
        return [] as Car[];
    }
}

export async function confirmTrans(code?: string) {
    if (!code) return false;
    return await axios
        .put(`/wallets/confirm?code=${code}`)
        .then(() => true)
        .catch(() => false);
}

export async function fetchRecentBooking() {
    return await axios
        .get('/car-owners/cars/recent-rents', {
            headers: await getAuthHeader(),
        })
        .then(res => {
            return res.data.result.data as RecentRent[];
        })
        .catch(() => [] as RecentRent[]);
}
