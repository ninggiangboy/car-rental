import { Car } from '@/lib/defines';
import CarCard from '../car-card';

export default function RelatedCar({
    listCars,
}: Readonly<{ listCars: Car[] }>) {
    return (
        <>
            <div className="mb-3 mt-5">
                <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600 flex gap-2">
                    Related Cars:
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listCars.map((car, index) => (
                    <CarCard key={index} car={car} />
                ))}
            </div>
        </>
    );
}
