import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalysisCard({
    title,
    value,
    percentage,
    icon,
}: {
    title: string;
    value: string;
    percentage?: number;
    icon: React.JSX.Element;
}) {
    return (
        <div className="grid gap-4 md:grid-cols-1 mt-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">
                        {percentage &&
                            `${percentage >= 0 ? '+' : ''}${percentage}% from last month`}
                        {/* {!percentage && 'First month of this car'} */}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
