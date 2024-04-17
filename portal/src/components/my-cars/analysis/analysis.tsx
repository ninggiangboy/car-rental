import {
    LayersIcon,
    PlusIcon,
    RocketIcon,
    StackIcon,
    StarFilledIcon,
} from '@radix-ui/react-icons';
import AnalysisCard from './analysis-card';
import {
    fetchCarOwnerRevenue,
    fetchCarRevenue,
    fetchCarsRevenue,
} from '@/lib/actions';
import { getFormatPoint } from '@/lib/utils';

export default async function Analysis() {
    const revenue = await fetchCarsRevenue();
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnalysisCard
                title="Total Revenue"
                value={`$${getFormatPoint(revenue.totalRevenue)}`}
                icon={<LayersIcon />}
            />
            <AnalysisCard
                title="Total Revenue this month"
                value={`$${getFormatPoint(revenue.monthRevenue.currentMonthRevenue)}`}
                percentage={revenue.monthRevenue.growthRevenueRate}
                icon={<StackIcon />}
            />
            <AnalysisCard
                title="Average Rating"
                value={revenue.avgRating + ''}
                icon={<StarFilledIcon />}
            />
            <AnalysisCard
                title="Total Complete Bookings"
                value={revenue.totalRides + ''}
                icon={<RocketIcon />}
            />
        </div>
    );
}
