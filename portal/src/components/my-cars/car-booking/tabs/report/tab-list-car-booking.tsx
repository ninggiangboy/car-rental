'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TabListCarBooking({ param }: { param: number }) {
    const { replace } = useRouter();
    const handleTabChange = (tab: string) => {
        const searchParams = new URLSearchParams(location.search);
        const pathName = location.pathname;
        searchParams.set('tab', tab);
        searchParams.delete('rating');
        searchParams.delete('page');
        searchParams.delete('perPage');
        searchParams.delete('start');
        searchParams.delete('end');
        searchParams.delete('status');
        replace(createUrl(pathName, searchParams));
    };

    return (
        <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 md:w-[600px]">
                <TabsTrigger
                    value="pending"
                    onClick={() => handleTabChange('pending')}
                >
                    Pending Request
                </TabsTrigger>
                <TabsTrigger
                    value="uncomplete"
                    onClick={() => handleTabChange('uncomplete')}
                >
                    Ongoing Process
                </TabsTrigger>
                <TabsTrigger
                    value="report"
                    onClick={() => handleTabChange('report')}
                >
                    Final Status
                </TabsTrigger>
            </TabsList>
        </div>
    );
}
