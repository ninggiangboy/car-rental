import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { format, isThisYear } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const setCSSVariable = (name: string, value: string) => {
    if ('undefined' !== typeof window && window?.document?.documentElement) {
        window.document.documentElement.style.setProperty(name, value);
    }
};

export const createUrl = (
    pathname: string,
    params: URLSearchParams | ReadonlyURLSearchParams
) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

    return `${pathname}${queryString}`;
};

export const jwt = {
    decode: (token: string | undefined) => {
        if (!token) return;
        return JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
    },
};

// export const getDateFormatted = (params: string) => {
//     const date = new Date(params);
//     const dateFormat = isThisYear(date) ? 'MMM d' : 'MMM d, yyyy';
//     return format(date, dateFormat);
// };

export const getDateFormatted = (params: string) => {
    const date = new Date(params);
    const dateFormat = isThisYear(date)
        ? 'MMM d, h:mm a'
        : 'MMM d, yyyy, h:mm a';
    return format(date, dateFormat);
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', {
        month: 'short',
    })} ${date.getDate()}`;
}

export function formatDates(checkin: string, checkout: string): string {
    const formattedCheckin = formatDate(checkin);
    const formattedCheckout = formatDate(checkout);

    // Check if both dates share the same month
    const checkinMonth = new Date(checkin).getMonth();
    const checkoutMonth = new Date(checkout).getMonth();
    const sameMonth = checkinMonth === checkoutMonth;

    if (sameMonth) {
        return `${formattedCheckin} – ${new Date(checkout).getDate()}`;
    } else {
        return `${formattedCheckin} – ${formattedCheckout}`;
    }
}

export function getFormatPoint(points: number) {
    !points && (points = 0);
    return points.toLocaleString('de-DE');
}
