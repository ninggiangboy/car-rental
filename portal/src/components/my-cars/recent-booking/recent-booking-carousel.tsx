import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import RecentBookingCard from "./recent-booking-card";
import { fetchRecentBooking } from "@/lib/actions";

export default async function RecentBookingCarousel() {
  const bookings = await fetchRecentBooking();
  console.log(bookings);
  return (
    <>
      {bookings.length !== 0 ? (
        <Carousel className="w-full my-5">
          <CarouselContent className="-ml-1">
            {bookings.map((booking, index) => (
              <CarouselItem
                key={index}
                className="pl-1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <RecentBookingCard booking={booking} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="my-2">
          <h1 className="text-xl font-semibold text-slate-700">
            There are no ongoing bookings to follow
          </h1>
        </div>
      )}
    </>
  );
}
