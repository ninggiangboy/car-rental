import CarNotFound from "@/components/cars/car-detail/car-not-found";
import { fetchCarDetailById } from "@/lib/actions";
import { SearchCarParams, SearchParams } from "@/lib/defines";
import { addDays } from "date-fns";
import CarDetail from "@/components/cars/car-detail/car-detail";

export default async function CarDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SearchCarParams;
}) {
  const car = await fetchCarDetailById(params.id);
  const checkin = searchParams[SearchParams.CHECKIN];
  const checkout = searchParams[SearchParams.CHECKOUT];
  const page = searchParams[SearchParams.PAGE] || 1;
  const perPage = searchParams[SearchParams.PER_PAGE] || 3;

  const checkinDate = new Date(checkin || new Date());
  const checkoutDate = new Date(checkout || addDays(new Date(), 1));
  if (!car)
    return (
      <div className="flex justify-center">
        <CarNotFound />
      </div>
    );
  return (
    <CarDetail
      car={car}
      checkin={checkinDate}
      checkout={checkoutDate}
      page={page}
      perPage={perPage}
    />
  );
}
