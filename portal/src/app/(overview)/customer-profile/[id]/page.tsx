import {
  fetchCarsBooked,
  fetchCustomerProfile,
  fetchUserProfile,
  getUser,
} from "@/lib/actions";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClockIcon, RocketIcon, StarIcon } from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarCard from "@/components/cars/car-card";
import { getDateFormatted } from "@/lib/utils";
import { Car } from "@/lib/defines";
import { format } from "date-fns";

export default async function CustomerProfile({
  params,
}: {
  params: { id: string };
}) {
  const customer = await fetchCustomerProfile(params.id);

  const cars = await fetchCarsBooked(params.id);

  if (!customer.lastRent) {
    return (
      <>
        <Card className="px-5 md:px-8 xl:px-16 py-8 flex flex-col gap-10 justify-between md:flex-row mb-10">
          <div className="flex gap-5 justify-center md:justify-start">
            <Avatar className="h-[70px] w-[70px] border-[3px]">
              <AvatarImage src={customer.image} alt="avatar" />
              <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                <span className="text-xl font-bold">{customer.fullName}</span>
              </CardTitle>
              <CardDescription>{customer.email}</CardDescription>
              <CardDescription>{customer.phoneNumber}</CardDescription>
            </div>
          </div>

          <div className="flex gap-10 lg:gap-16 justify-center">
            {customer.totalCompletedRides != 0 && (
              <div className="flex flex-col text-center gap-2 justify-start">
                <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
                  Completed Rate
                </span>
                <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
                  {/* <StarIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" /> */}
                  {customer.rateCompletedRent.toFixed(1)}%
                </span>
              </div>
            )}
            <div className="flex flex-col text-center gap-2 justify-start">
              <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
                Total completed rides
              </span>
              <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
                <RocketIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
                {customer.totalCompletedRides}
              </span>
            </div>

            {customer.lastRent && (
              <div className="flex flex-col text-center gap-2 justify-start">
                <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
                  Last Rent
                </span>
                <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
                  <ClockIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
                  {getDateFormatted(customer.lastRent)}
                </span>
              </div>
            )}
          </div>
        </Card>
        <div className="text-lg font-bold">This user do not have any rent.</div>
      </>
    );
  }
  return (
    <>
      <Card className="px-5 md:px-8 xl:px-16 py-8 flex flex-col gap-10 justify-between md:flex-row mb-10">
        <div className="flex gap-5 justify-center md:justify-start">
          <Avatar className="h-[70px] w-[70px] border-[3px]">
            <AvatarImage src={customer.image} alt="avatar" />
            <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>
              <span className="text-xl font-bold">{customer.fullName}</span>
            </CardTitle>
            <CardDescription>{customer.email}</CardDescription>
            <CardDescription>{customer.phoneNumber}</CardDescription>
          </div>
        </div>

        <div className="flex gap-10 lg:gap-16 justify-center">
          {customer.totalCompletedRides != 0 && (
            <div className="flex flex-col text-center gap-2 justify-start">
              <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
                Completed Rate
              </span>
              <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
                {/* <StarIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" /> */}
                {customer.rateCompletedRent.toFixed(1)}%
              </span>
            </div>
          )}
          <div className="flex flex-col text-center gap-2 justify-start">
            <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
              Total completed rides
            </span>
            <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
              <RocketIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
              {customer.totalCompletedRides}
            </span>
          </div>

          {customer.lastRent && (
            <div className="flex flex-col text-center gap-2 justify-start">
              <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
                Last Rent
              </span>
              <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
                <ClockIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
                {format(customer.lastRent, "PPP")}
              </span>
            </div>
          )}
        </div>
      </Card>

      <div className="text-2xl font-bold mb-7">Recent Booked Cars</div>

      <Carousel className="w-full justify-center">
        <CarouselContent>
          {cars.map((car) => (
            <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/4">
              <CarCard car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {cars.length >= 4 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </>
  );
}
