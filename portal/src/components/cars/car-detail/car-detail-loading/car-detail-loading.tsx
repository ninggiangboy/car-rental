'use client';

import { Card } from '@/components/ui/card';
import CarHeaderInforLoading from './car-header-infor-loading';
import { Skeleton } from '@/components/ui/skeleton';
import CarInforLoading from './car-infor-loading';

export default function CarDetailLoading() {
    return (
        <div>
            <Card className="p-5 md:px-8 md:py-8 xl:px-16 xl:py-8 my-5 gap-2">
                <CarHeaderInforLoading />
            </Card>
            <div className="py-3">
                <Skeleton className="h-[2rem] w-[12rem] rounded-sm" />
            </div>

            <CarInforLoading />
        </div>
    );
}
