import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BalanceCardLoading() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
                <Skeleton className="h-5 w-[50px]" />
            </CardHeader>
            <CardContent className="flex justify-between">
                <div className="h-[2rem]">
                    <Skeleton className="h-7 w-[150px]" />
                </div>
            </CardContent>
        </Card>
    );
}
