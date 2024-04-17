import BookingLoading from "@/components/booking/booking-loading/booking-loading";
import FilterBooking from "@/components/booking/filter-booking";
import SortSelectBooking from "@/components/booking/sort-select-booking";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <span className={`text-3xl font-bold text-neutral-600`}>My Bookings</span>
      <div className="flex justify-between mt-5">
        <div className="flex gap-2 ">
          <FilterBooking sort="all" />
          <SortSelectBooking sort="all" />
        </div>
      </div>
      <div className=" mt-5">
        <Skeleton className="h-6 w-[10rem] rounded-sm" />
      </div>
      <BookingLoading />
    </>
  );
}
