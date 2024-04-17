import { Renter } from '@/lib/defines';
import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

export default function DetailRental({
    renter,
    driver,
}: {
    renter: Renter;
    driver?: Renter;
}) {
    return (
        <div>
            {renter && (
                <div className="text-sm z-[1000000]">
                    <div className=" grid grid-cols-3 gap-2 ">
                        <div className="flex flex-col gap-2 text-center">
                            <span className="font-semibold">Renter</span>
                            <span>{renter?.name}</span>
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <span className="font-semibold">Phone number</span>
                            <span>{renter?.phoneNumber}</span>
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <span className="font-semibold">National ID</span>
                            <span>{renter?.nationalId}</span>
                        </div>
                    </div>
                    {!driver?.name && (
                        <div className="mt-2">
                            <AspectRatio ratio={16 / 9} className="bg-muted">
                                <Image
                                    src={renter?.driverLicense}
                                    alt="Renter license photo"
                                    layout="fill"
                                    className="rounded-md object-cover"
                                />
                            </AspectRatio>
                        </div>
                    )}
                </div>
            )}
            {driver?.name && (
                <>
                    <Separator className="my-4" />
                    <div className="text-sm z-[1000000]">
                        <div className=" grid grid-cols-3 gap-2 ">
                            <div className="flex flex-col gap-2 text-center">
                                <span className="font-semibold">Driver</span>
                                <span>{driver?.name}</span>
                            </div>
                            <div className="flex flex-col gap-2 text-center">
                                <span className="font-semibold">
                                    Phone number
                                </span>
                                <span>{driver?.phoneNumber}</span>
                            </div>
                            <div className="flex flex-col gap-2 text-center">
                                <span className="font-semibold">
                                    National ID
                                </span>
                                <span>{driver?.nationalId}</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <AspectRatio ratio={16 / 9} className="bg-muted">
                                <Image
                                    src={driver?.driverLicense}
                                    alt="Driver license photo"
                                    layout="fill"
                                    className="rounded-md object-cover"
                                />
                            </AspectRatio>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
