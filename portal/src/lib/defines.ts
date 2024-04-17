import CarOwner from '@/components/cars/car-detail/car-owner';
import 'next-auth/jwt';

export enum ROLE {
    CUSTOMER,
    CAROWNER,
    GUEST,
}

export enum SearchParams {
    LOCATION = 'location',
    CHECKIN = 'checkin',
    CHECKOUT = 'checkout',
    MIN_PRICE = 'minPrice',
    MAX_PRICE = 'maxPrice',
    BODY_STYLE = 'bodyStyle',
    ENGINE_TYPE = 'fuelType',
    NO_SEATS = 'numberOfSeats',
    TRANSMISSION = 'transmissionType',
    MAX_FUEL = 'maxFuelConsumption',
    MIN_FUEL = 'minFuelConsumption',
    SORT = 'sort',
    PAGE = 'page',
    PER_PAGE = 'perPage',
    MODE = 'mode',
}

export enum BookingStatus {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    PENDING_DEPOSIT = 'PENDING_DEPOSIT',
    PENDING_CONFIRM_DEPOSIT = 'PENDING_CONFIRM_DEPOSIT',
    PENDING_PICKUP = 'PENDING_PICKUP',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PENDING_CONFIRM_PAYMENT = 'PENDING_CONFIRM_PAYMENT',
}

export type SearchCarParams = {
    [SearchParams.LOCATION]?: string;
    [SearchParams.CHECKIN]?: string;
    [SearchParams.CHECKOUT]?: string;
    [SearchParams.MIN_PRICE]?: number;
    [SearchParams.MAX_PRICE]?: number;
    [SearchParams.BODY_STYLE]?: string;
    [SearchParams.ENGINE_TYPE]?: string;
    [SearchParams.NO_SEATS]?: number;
    [SearchParams.TRANSMISSION]?: string;
    [SearchParams.SORT]?: string;
    [SearchParams.PAGE]?: number;
    [SearchParams.PER_PAGE]?: number;
    [SearchParams.MODE]?: string;
    [SearchParams.MAX_FUEL]?: number;
    [SearchParams.MIN_FUEL]?: number;
};

export type PageMeta = {
    totalPages: number;
    page: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type AuthRequest = {
    email: string;
    password: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
};

export type User = {
    role: string;
    fullName: string;
    picture: string;
    sub: string;
    email: string;
    iat: number;
    exp: number;
};

export type Location = {
    id: string;
    path: string;
};

export type Car = {
    id: number;
    carName: string;
    brandName: string;
    modelName: string;
    year: number;
    basePrice: number;
    location: string;
    rating: number;
    numberOfRides: number;
    numberOfSeats: number;
    transmissionType: string;
    fuelType: string;
    fuelConsumption: number;
    mileage: number;
    status: string;
    images: string[];
};

export type CarReservation = {
    id: number;
    modelName: string;
    brandName: string;
    year: number;
    carName: string;
    numberOfRides: number;
    rating: number;
    basePrice: number;
    deposit: number;
    location: string;
};

export type FeatureLocations = {
    id: string;
    imageUrl: string;
    name: string;
    numberOfCars: number;
    minPrice: number;
};

export type CarDetailInfo = {
    id: number;
    licensePlate: string;
    brandName: string;
    modelName: string;
    featureNames: string[];
    year: number;
    colorName: string;
    numberOfSeats: number;
    transmissionType: string;
    fuelType: string;
    mileage: number;
    fuelConsumption: number;
    basePrice: number;
    deposit: number;
    location: string;
    description: string;
    termOfUse: string;
    carOwnerId: string;
    status: string;
    images: string[];
    rating: number;
    numberOfRides: number;
    createdAt: string;
};

export type CarOwner = {
    fullName: string;
    picture: string;
    averageRating: number;
    totalRides: number;
    joinDate: string;
};

export type Rating = {
    fullName: string;
    picture: string;
    rating: number;
    comment: string;
    createdAt: string;
};

// export type Booking = {
//     id: number;
//     startDate: string;
//     endDate: string;
//     basePrice: number;
//     deposit: number;
//     status: string;
//     brandName: string;
//     modelName: string;
//     carYear: number;
// };

export type Booking = {
    id: number;
    rentalStart: string;
    rentalEnd: string;
    totalPrice: number;
    deposit: number;
    rentalStatus: string;
    createdAt: string;
    carId: number;
    images: string[];
    carName: string;
    rate: number;
    comment: string;
    ratingTime: string;
};

export type RentalInfo = {
    id: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    deposit: number;
    status: string;
    renter: {
        name: string;
        phoneNumber: string;
        nationalId: string;
        driverLicense: string;
    };
    driver?: {
        name: string;
        phoneNumber: string;
        nationalId: string;
        driverLicense: string;
    };
};

export type AvailableDate = {
    startDate: Date;
    endDate: Date;
};

export type Transaction = {
    transactionCode: string;
    amount: number;
    transactionType: string;
    transactionStatus: string;
    createdAt: string;
    transactionDesc: string;
    bookingNo: number;
    paymentMethod: string;
};

export type PendingTransaction = {
    pendingReceive: number;
    pendingPayment: number;
};

export type BookingListRecord = {
    id: number;
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        phoneNumber: string;
    };
    rentalStart: string;
    rentalEnd: string;
    totalPrice: number;
    deposit: number;
    rentalStatus: string;
    createdAt: string;
    carId: number;
    renter: {
        name: string;
        phoneNumber: string;
        nationalId: string;
        driverLicense: string;
    };
    driver: {
        name: string;
        phoneNumber: string;
        nationalId: string;
        driverLicense: string;
    };
    rate: number;
    comment: string;
    ratingTime: string;
};

export type Revenue = {
    monthRevenue: {
        currentMonthRevenue: number;
        previousMonthRevenue: number;
        growthRevenueRate: number;
    };
    totalRevenue: number;
    avgRating: number;
    totalRides: number;
};

export type UserRentalInfo = {
    userId: string;
    totalCompletedRides: number;
    rateCompletedRent: number;
    lastRent: string;
};

export type Renter = {
    name: string;
    phoneNumber: string;
    nationalId: string;
    driverLicense: string;
};

export type RentalTransaction = {
    amount: number;
    paymentMethod: string;
    createdAt: string;
    transactionStatus: string;
};

export type Bank = {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    short_name: string;
    support: number;
    isTransfer: number;
    swift_code: string;
};

export type WalletInfo = {
    pendingReceive: number;
    pendingPayment: number;
    pendingReceiveWallet: number;
    pendingPaymentWallet: number;
};

export type Profile = {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    image: string[];
    nationalId: string;
    driverLicense: string;
};

export type CustomerProfile = {
    fullName: string;
    email: string;
    phoneNumber: string;
    age: number;
    image: string;
    totalCompletedRides: number;
    rateCompletedRent: number;
    lastRent: Date;
};

// private Integer carId;
//     private Integer rentalId;
//     private String carName;
//     private String carImage;
//     private Instant carRentDate;
//     private RentalStatus status;
//     private Integer numberOfRent;

export type RecentRent = {
    carId: number;
    rentalId: number;
    carName: string;
    carImage: string;
    lastModified: string;
    startDate: string;
    endDate: string;
    status: string;
    numberOfPending: number;
};
