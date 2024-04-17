import { SearchParams } from "@/lib/defines";
import { NavigateBack } from "@/components/ui/navigate-back";
import BookingForm from "@/components/reservation/booking-form";
import {
  fetchAvailableDate,
  fetchCarDetails,
  fetchUserProfile,
  getUser,
} from "@/lib/actions";
import { format } from "date-fns";

interface ReservationPageProps {
  searchParams: {
    [SearchParams.LOCATION]: string;
    [SearchParams.CHECKIN]: string;
    [SearchParams.CHECKOUT]: string;
    car: number;
  };
}

export default async function ReservationPage({
  searchParams,
}: ReservationPageProps) {
  const user = await fetchUserProfile();
  const carInfo = await fetchCarDetails(searchParams.car);
  if (!carInfo) {
    return (
      <div className="w-full h-[70vh]">
        <div className="flex justify-center items-center h-full">
          <div className="text-2xl font-bold">Not Found Car</div>
        </div>
      </div>
    );
  }
  const availableDate = await fetchAvailableDate(searchParams.car);
  if (availableDate.length === 0) {
    return (
      <div className="w-full h-[70vh]">
        <div className="flex justify-center items-center h-full">
          <div className="text-2xl font-bold">
            Car is not have any available dates to rent
          </div>
        </div>
      </div>
    );
  }
  const checkin = new Date(searchParams[SearchParams.CHECKIN]) || new Date();
  const checkout = new Date(searchParams[SearchParams.CHECKOUT]) || new Date();
  return (
    <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 xl:max-w-6xl my-10">
      <div className="hidden md:block">
        <div className="flex items-center">
          <div className="relative">
            <h1 className="text-3xl font-semibold flex gap-2">
              <NavigateBack />
              <span>Booking</span>
            </h1>
          </div>
        </div>
      </div>
      <BookingForm
        user={user}
        car={carInfo}
        checkin={checkin}
        checkout={checkout}
        availableDate={availableDate}
      />
    </div>
  );
}
