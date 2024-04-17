import { CarDetailInfo } from "@/lib/defines";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { fetchCarOwnerById } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDateFormatted } from "@/lib/utils";
import { ClockIcon, RocketIcon, StarIcon } from "@radix-ui/react-icons";

export default async function CarOwner({
  car,
}: Readonly<{ car: CarDetailInfo }>) {
  const carOwner = await fetchCarOwnerById(car.carOwnerId);

  if (!carOwner) return <></>;

  return (
    <Card className="px-5 md:px-8 xl:px-16 py-8 flex flex-col gap-10 justify-between md:flex-row">
      <div className="flex gap-5 justify-center md:justify-start">
        <Avatar className="h-[60px] w-[60px] border-[3px]">
          <AvatarImage src={carOwner.picture} alt="avatar" />
          <AvatarFallback>{carOwner.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            <span className="text-lg font-bold">{carOwner.fullName}</span>
          </CardTitle>
          <CardDescription>Car Owner</CardDescription>
        </div>
      </div>

      <div className="flex gap-10 lg:gap-16 justify-center">
        <div className="flex flex-col text-center gap-2 justify-start">
          <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
            Avg Rating
          </span>
          <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
            <StarIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
            {carOwner.averageRating}
          </span>
        </div>
        <div className="flex flex-col text-center gap-2 justify-start">
          <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
            Total rides
          </span>
          <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
            <RocketIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
            {carOwner.totalRides}
          </span>
        </div>
        <div className="flex flex-col text-center gap-2 justify-start">
          <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600">
            Join date
          </span>
          <span className="lg:text-lg sm:text-sm md:text-base text-neutral-600 font-medium flex gap-2 justify-center">
            <ClockIcon className="lg:h-[1.75rem] sm:h-[1.25rem] md:h-[1.5rem]" />
            {getDateFormatted(carOwner.joinDate).split(",")[0]}
          </span>
        </div>
      </div>
    </Card>
  );
}
