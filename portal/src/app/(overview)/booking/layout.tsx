import React from 'react';
import SearchForm from '@/components/overview/search-form';

export default function BookingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="sticky z-50 top-6 -my-[33px] h-[58px] w-[720px] mx-auto hidden lg:flex">
                <SearchForm compact />
            </div>
            <main className="bg-neutral-50 md:px-20 md:py-8 lg:px-32 lg:py-16 px-5 py-3">
                {children}
            </main>
        </>
    );
}
