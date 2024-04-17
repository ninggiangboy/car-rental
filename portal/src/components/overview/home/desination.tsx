import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FeatureLocations, SearchParams } from "@/lib/defines";
import Link from "next/link";
import Image from "next/image";
export default function Destination({
  locations,
}: {
  locations: FeatureLocations[];
}) {
  return (
    <div className="group -mx-2 mt-8 grid grid-cols-1 items-center justify-between sm:grid-cols-2 md:grid-cols-4 [&_a:hover_img]:!brightness-110">
      {locations.map((location) => (
        <Link
          key={location.id}
          href={{
            pathname: "/cars",
            query: {
              [SearchParams.LOCATION]: location.id,
            },
          }}
          className="px-1.5 pb-4 pt-1"
        >
          <div className="h-full w-full group-hover:[&_img]:brightness-75">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={location.imageUrl}
                alt={location.name}
                width={1600}
                height={900}
                className="h-full w-full rounded-2xl border object-cover object-center transition-all duration-300"
              />
            </AspectRatio>
          </div>
          <div className="mt-3">
            <h3 className="text-[15px] font-semibold">{location.name}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {`${location.numberOfCars}+ Cars Available`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
