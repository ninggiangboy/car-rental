import React from 'react';
import SearchForm from '@/components/overview/search-form';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="bg-neutral-50 max-w-96 mx-auto my-8 md:my-32">
            {children}
        </main>
    );
}
