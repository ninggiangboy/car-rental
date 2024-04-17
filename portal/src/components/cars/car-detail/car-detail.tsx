import { Card } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CarBasicInfor from './car-basic-infor';
import CarDetailInfor from './car-detail-infor';
import CarTermOfUse from './car-term-of-use';
import CarHeaderInfor from './car-header-infor';
import CarOwner from './car-owner';
import CarRating from './car-rating';
import { fetchRelatedCarsByCarId } from '@/lib/actions';
import RelatedCar from './related-car';
import { CarDetailInfo } from '@/lib/defines';

export default async function CarDetail({
    car,
    checkin,
    checkout,
    page,
    perPage,
}: Readonly<{
    car: CarDetailInfo;
    checkin: Date;
    checkout: Date;
    page: number;
    perPage: number;
}>) {
    const relatedCars = await fetchRelatedCarsByCarId(car.id);
    return (
        <div>
            <Card className="p-5 md:px-8 md:py-8 xl:px-16 xl:py-8 my-5 gap-2">
                <CarHeaderInfor
                    car={car}
                    checkin={checkin}
                    checkout={checkout}
                />
            </Card>
            <Tabs defaultValue="basic">
                <TabsList className="max-md:flex max-md:justify-center">
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="detail">Details</TabsTrigger>
                    <TabsTrigger value="term">Term Of Use</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-6">
                    <Card className="p-5 md:px-8 md:py-5 xl:px-16 xl:py-8 my-5 gap-2">
                        <CarBasicInfor car={car} />
                    </Card>
                </TabsContent>
                <TabsContent value="detail" className="mt-6">
                    <Card className="p-5 md:px-8 md:py-5 xl:px-16 xl:py-8 my-5 gap-2">
                        <CarDetailInfor car={car} />
                    </Card>
                </TabsContent>
                <TabsContent value="term" className="mt-6">
                    <Card className="p-5 md:px-8 md:py-5 xl:px-16 xl:py-8 my-5 gap-2">
                        <CarTermOfUse car={car} />
                    </Card>
                </TabsContent>
            </Tabs>

            <CarOwner car={car} />

            <CarRating carId={car.id} averageRating={car.rating} />
            <RelatedCar listCars={relatedCars} />
        </div>
    );
}
