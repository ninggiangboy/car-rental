import { CarDetailInfo } from '@/lib/defines';

import { Separator } from '@/components/ui/separator';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

const additionFuncs = [
    {
        name: 'Bluetooth',
        icon: '/icons/bluetooth.svg',
    },
    {
        name: 'GPS',
        icon: '/icons/gps.svg',
    },
    {
        name: 'Camera',
        icon: '/icons/camera.svg',
    },
    {
        name: 'Sun roof',
        icon: '/icons/sun-roof.svg',
    },
    {
        name: 'Child lock',
        icon: '/icons/child-lock.svg',
    },
    {
        name: 'Child seat',
        icon: '/icons/child-seat.svg',
    },
    {
        name: 'DVD',
        icon: '/icons/dvd.svg',
    },
    {
        name: 'USB',
        icon: '/icons/usb.svg',
    },
];

export default function CarDetailInfor({
    car,
}: Readonly<{ car: CarDetailInfo }>) {
    return (
        <div>
            <div className="flex flex-col gap-5 justify-between md:flex-row ">
                <div className="flex gap-[6rem]">
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-bold text-neutral-600">
                            License plate:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Brand name:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Model:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Production Year:
                        </span>
                    </div>
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-medium text-neutral-600">
                            {car.licensePlate}
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {car.brandName}
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {car.modelName}
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {car.year}
                        </span>
                    </div>
                </div>
                <div className="flex gap-[5.7rem] md:gap-10">
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-bold text-neutral-600">
                            Color:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Mileage:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Fuel Consumtion:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Address:
                        </span>
                    </div>
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-medium text-neutral-600">
                            {car.colorName}
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {car.mileage} km
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {`${car.fuelConsumption} L/100km`}
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {car.location}
                        </span>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col gap-5 justify-between md:flex-row ">
                <div className="flex gap-10">
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-bold text-neutral-600  ">
                            Registration paper:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Certificate of Inspection:
                        </span>
                        <span className="text-sm font-bold text-neutral-600 ">
                            Insurance:
                        </span>
                    </div>

                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-medium text-neutral-600 ">
                            <CheckCircledIcon className="h-[1.25rem] text-green-400" />
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            <CheckCircledIcon className="h-[1.25rem] text-green-400" />
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            <CrossCircledIcon className="h-[1.25rem] text-red-400" />
                        </span>
                    </div>
                </div>

                <Separator orientation="vertical" />

                {/* <div className="flex gap-10">
                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-bold text-neutral-600">
                            Mileage:
                        </span>
                        <span className="text-sm font-bold text-neutral-600">
                            Fuel Consumtion:
                        </span>
                    </div>

                    <div className="flex flex-col gap-5">
                        <span className="text-sm font-medium text-neutral-600">
                            {car.mileage} km
                        </span>
                        <span className="text-sm font-medium text-neutral-600">
                            {`${car.fuelConsumption} L/100km`}
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
