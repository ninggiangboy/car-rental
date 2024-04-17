import { Car } from "@/lib/defines";
import CarThumbnail from "./my-car-thumbnail";
import CarCard from "../cars/car-card";

export default function CarList({
  cars,
}: {
  cars: Car[];
}) {
  if (!cars || cars.length === 0) {
    return (
      <div className="my-10">
        <h1 className="text-xl font-semibold">No exact matches</h1>
        <p className="mt-3 text-slate-700">
          Try changing or removing some of your filters.
        </p>
      </div>
    );
  }
    return (
      <div className="relative justify-center items-center">
        {cars.map((car, index) => (
          <CarThumbnail car={car} key={car.id} />
        ))}
      </div>
    );
  
}
