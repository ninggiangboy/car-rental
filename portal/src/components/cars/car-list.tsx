import { Car } from "@/lib/defines";
import CarThumbnail from "./car-thumbnail";
import CarCard from "./car-card";

export default function CarList({
  cars,
  mode,
}: {
  cars: Car[];
  mode?: string;
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
  if (!mode || mode === "grid") {
    return (
      <div className="my-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] items-stretch justify-center gap-6">
        {cars.map((car, index) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="relative justify-center items-center">
        {cars.map((car, index) => (
          <CarThumbnail car={car} key={car.id} />
        ))}
      </div>
    );
  }
}
