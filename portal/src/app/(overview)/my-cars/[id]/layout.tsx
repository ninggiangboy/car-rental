import HeaderSite from '@/components/overview/header-site';
import React, { Suspense } from 'react';
import FooterSite from '@/components/overview/home/footer-site';
import AnalysisLoading from '@/components/my-cars/car-booking/loading/analysis/analysis-loading';
import Analysis from '@/components/my-cars/car-booking/analysis/analysis';
import { ROLE } from '@/lib/defines';
import { getUserRole } from '@/lib/actions';
import NotHavePermission from '@/components/my-cars/car-booking/not-found/not-have-permission';

export default async function CarBookingLayout({
    params,
    children,
}: Readonly<{
    params: { id: number };
    children: React.ReactNode;
}>) {
    const userRole = await getUserRole();

    if (userRole !== ROLE.CAROWNER) {
        return <NotHavePermission />;
    }
    return (
        <>
            <div className="bg-background scroll-smooth">
                <main>
                    <div className="bg-neutral-50 md:px-20 md:py-8 lg:px-32 lg:py-16 px-5 py-3">
                        <span className={`text-3xl font-bold text-neutral-600`}>
                            Car Booking
                        </span>
                        <Suspense fallback={<AnalysisLoading />}>
                            <Analysis carId={params.id} />
                        </Suspense>
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
