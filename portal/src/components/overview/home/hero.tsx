import React from "react";
import SearchForm from "@/components/overview/search-form";
import LogoSlider from "@/components/overview/home/logo-slider";
import { Icons } from "@/components/icons";

function Hero() {
  return (
    <section className="pt-12 pb-14 bg-neutral-50">
      <h1 className="mt-10 text-center text-3xl font-extrabold">
        Find your car
      </h1>
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 items-center justify-center gap-4 md:flex md:flex-row md:gap-12">
        <div className="flex items-center justify-center gap-1.5">
          <Icons.checkCircle className="h-5 w-5 shrink-0 text-green-600" />
          <span className="text-sm text-neutral-900">No hidden fees.</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Icons.checkCircle className="h-5 w-5 shrink-0 text-green-600" />
          <span className="text-sm text-neutral-900">Transparent pricing.</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Icons.checkCircle className="h-5 w-5 shrink-0 text-green-600" />
          <span className="text-sm text-neutral-900">
            Flexible cancellations.
          </span>
        </div>
      </div>
      <div className="mt-5 hidden md:block">
        <SearchForm compact={false} />
      </div>
      <div className="mt-14">
        <LogoSlider />
      </div>
    </section>
  );
}

export default Hero;
