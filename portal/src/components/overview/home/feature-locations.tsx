import { fetchFeaturedLocations } from "@/lib/actions";
import { Suspense } from "react";
import Destination from "./desination";

export default async function FeatureLocations() {
  const currency = "MXN";
  const featuredLocations = await fetchFeaturedLocations();

  return (
    <section className="pt-10 mb-10">
      <div className="mx-auto w-full max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <h2 className="text-2xl font-bold text-center">Featured Locations</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Destination locations={featuredLocations} />
        </Suspense>
      </div>
    </section>
  );
}
