import Analysis from '@/components/my-cars/car-booking/analysis/analysis';
import AnalysisLoading from '@/components/my-cars/car-booking/loading/analysis/analysis-loading';
import PendingRequestLoading from '@/components/my-cars/car-booking/loading/pending-request/pending-request-loading';
import ReportLoading from '@/components/my-cars/car-booking/loading/report/report-loading';
import UncompleteLoading from '@/components/my-cars/car-booking/loading/uncomplete/uncomplete-loading';
import NotHavePermission from '@/components/my-cars/car-booking/not-found/not-have-permission';
import PendingRequest from '@/components/my-cars/car-booking/tabs/pending-request/pending-request';
import Report from '@/components/my-cars/car-booking/tabs/report/report';
import TabListCarBooking from '@/components/my-cars/car-booking/tabs/report/tab-list-car-booking';
import Uncomplete from '@/components/my-cars/car-booking/tabs/uncomplete/uncomplete';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Suspense } from 'react';

export default async function CarBookingPage({
    params,
    searchParams,
}: {
    params: { id: number };
    searchParams: {
        page: number;
        perPage: number;
        status: string;
        rating: string;
        tab: string;
    };
}) {
    return (
        <div>
            {/*Begin tabs */}
            <Tabs defaultValue={searchParams.tab || 'pending'} className="mt-7">
                <TabListCarBooking param={params.id} />

                {/* Begin pending request */}
                <TabsContent value="pending">
                    <Suspense
                        key={
                            searchParams.rating +
                            searchParams.status +
                            params.id +
                            searchParams.page
                        }
                        fallback={<PendingRequestLoading />}
                    >
                        <PendingRequest
                            statusFilter={searchParams.status}
                            carId={params.id}
                            page={searchParams.page}
                        />
                    </Suspense>
                </TabsContent>
                {/* End pending request */}

                {/* Begin uncomplete */}
                <TabsContent value="uncomplete">
                    <Suspense
                        key={
                            searchParams.rating +
                            searchParams.status +
                            params.id +
                            searchParams.page
                        }
                        fallback={<UncompleteLoading />}
                    >
                        <Uncomplete
                            statusFilter={searchParams.status}
                            carId={params.id}
                            page={searchParams.page}
                        />
                    </Suspense>
                </TabsContent>
                {/* End uncomplete */}

                {/* Begin report */}
                <TabsContent value="report">
                    <Suspense
                        key={
                            searchParams.rating +
                            searchParams.status +
                            params.id +
                            searchParams.page
                        }
                        fallback={<ReportLoading />}
                    >
                        <Report
                            ratingFilter={searchParams.rating}
                            statusFilter={searchParams.status}
                            carId={params.id}
                            page={searchParams.page}
                        />
                    </Suspense>
                </TabsContent>
                {/* End report */}
            </Tabs>
            {/*End tabs */}
        </div>
    );
}
