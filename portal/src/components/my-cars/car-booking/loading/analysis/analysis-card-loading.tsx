import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalysisCardLoading() {
    return (
        <div className="grid gap-4 md:grid-cols-1 mt-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="h-[1.25rem]">
                        <Skeleton className="h-[1.25rem] w-[100px]" />
                    </CardTitle>
                    <Skeleton className="h-[1.25rem] w-[50px]" />
                </CardHeader>
                <CardContent>
                    <div className="h-[2rem]">
                        <Skeleton className="h-[1.5rem] w-[80px]" />
                    </div>
                    <p>
                        <Skeleton className="h-[1rem] w-[150px]" />
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
