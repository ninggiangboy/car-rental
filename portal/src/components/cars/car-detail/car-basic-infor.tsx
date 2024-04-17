import { CarDetailInfo } from '@/lib/defines';
import {
    ArrowRightIcon,
    EyeOpenIcon,
    FaceIcon,
    FileIcon,
    LightningBoltIcon,
    LockClosedIcon,
    MixerVerticalIcon,
    PaperPlaneIcon,
    ShadowIcon,
    SunIcon,
    TargetIcon,
    TextAlignJustifyIcon,
} from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';

const additionFuncs = [
    {
        name: 'Bluetooth',
        icon: <ArrowRightIcon />,
    },
    {
        name: 'GPS',
        icon: <PaperPlaneIcon />,
    },
    {
        name: 'Camera',
        icon: <EyeOpenIcon />,
    },
    {
        name: 'Sun roof',
        icon: <SunIcon />,
    },
    {
        name: 'Child lock',
        icon: <LockClosedIcon />,
    },
    {
        name: 'Child seat',
        icon: <FaceIcon />,
    },
    {
        name: 'DVD',
        icon: <ShadowIcon />,
    },
    {
        name: 'USB',
        icon: <TextAlignJustifyIcon />,
    },
];

export default function CarBasicInfor({
    car,
}: Readonly<{ car: CarDetailInfo }>) {
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-3 justify-between mb-6">
                <div className="flex justify-center md:justify-start gap-2">
                    <div className="flex flex-col justify-center">
                        <TargetIcon className="h-10 w-10 text-neutral-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center text-neutral-600 font-bold">
                            No. of seats
                        </div>
                        <div className="flex justify-center">
                            {car.numberOfSeats} SEATS
                        </div>
                    </div>
                </div>
                <div className="flex justify-center md:justify-start  gap-2">
                    <div className="flex flex-col justify-center">
                        <MixerVerticalIcon className="h-10 w-10 text-neutral-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center text-neutral-600 font-bold">
                            Transmission
                        </div>
                        <div className="flex justify-center">
                            {car.transmissionType}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center md:justify-start  gap-2">
                    <div className="flex flex-col justify-center">
                        <LightningBoltIcon className="h-10 w-10 text-neutral-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center text-neutral-600 font-bold">
                            Fuel
                        </div>
                        <div className="flex justify-center">
                            {car.fuelType}
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-3">
                    <span className="text-sm font-bold text-neutral-600  leading-none">
                        Description:
                    </span>
                    <span className="text-sm font-medium text-neutral-600">
                        {car.description}
                    </span>
                </div>
                <div className="col-span-1 flex flex-col justify-center">
                    <div className="flex justify-center">
                        <FileIcon className="h-14 w-14 text-neutral-600 hidden md:block" />
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            <div>
                <span className="text-sm font-bold text-neutral-600 leading-none">
                    Additional functions:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 mt-3 gap-y-3">
                    {additionFuncs
                        .filter(func => car.featureNames.includes(func.name))
                        .map((func, index) => (
                            <div key={index} className="flex gap-3 col-span-1">
                                <div className="flex flex-col justify-center">
                                    {func.icon}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-lg text-neutral-600">
                                        {func.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
                <div>
                    {car.featureNames.length === 0 && (
                        <div className="flex justify-center mt-3">
                            <span className="text-neutral-600">
                                No additional functions
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
