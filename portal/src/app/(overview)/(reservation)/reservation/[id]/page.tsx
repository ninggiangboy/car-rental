import { NavigateBack } from '@/components/ui/navigate-back';
import BookingForm from '@/components/reservation/booking-form';
import {
    fetchAvailableDate,
    fetchCarDetails,
    fetchRentalInfo,
} from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircledIcon } from '@radix-ui/react-icons';

export default async function ReservationDetailPage({
    params,
    searchParams,
}: {
    params: { id: number };
    searchParams: { created?: boolean; updated?: boolean };
}) {
    const info = await fetchRentalInfo(params.id);
    if (!info)
        return (
            <div className="w-full h-[70vh]">
                <div className="flex justify-center items-center h-full">
                    <div className="text-2xl font-bold">
                        Not Found Reservation
                    </div>
                </div>
            </div>
        );
    const car = await fetchCarDetails(info.carId);
    if (!car) {
        return (
            <div className="w-full h-[70vh]">
                <div className="flex justify-center items-center h-full">
                    <div className="text-2xl font-bold">Not Found Car</div>
                </div>
            </div>
        );
    }
    const availableDate = await fetchAvailableDate(car.id);
    return (
        <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 xl:max-w-6xl my-10">
            <div className="hidden md:block">
                <div className="flex items-center">
                    <div className="relative">
                        <h1 className="text-3xl font-semibold flex gap-2">
                            <NavigateBack />
                            <span>Booking Detail</span>
                        </h1>
                    </div>
                </div>
            </div>
            {searchParams.created && (
                <Alert className="my-10 border-green-600 text-green-600">
                    <AlertTitle className="flex gap-2">
                        <CheckCircledIcon /> Success Created
                    </AlertTitle>
                    <AlertDescription>
                        Your reservation has been successfully created. You will
                        need to car owner to confirm your reservation and after
                        that you can proceed to payment deposit (if any).
                    </AlertDescription>
                </Alert>
            )}
            {searchParams.updated && (
                <Alert className="my-10 border-green-600 text-green-600">
                    <AlertTitle className="flex gap-2">
                        <CheckCircledIcon /> Success Updated
                    </AlertTitle>
                    <AlertDescription>
                        Your reservation has been successfully updated.
                    </AlertDescription>
                </Alert>
            )}
            <BookingForm
                detailOnly
                info={info}
                car={car}
                availableDate={availableDate}
            />
        </div>
    );
}
