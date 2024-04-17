import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function CarExplorer() {
  return (
    <section className="border-t border-b py-16">
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <div className="flex flex-col items-start justify-between gap-x-6 gap-y-9 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold leading-9">
            <p>Make money on your car right away</p>
          </h2>
          <Button size="xl" className=" text-[15px] xl:flex" asChild>
            <Link
              href="/my-cars"
              className="flex items-center justify-center gap-x-3"
            >
              Explore Cars{" "}
              <Icons.ChevronForward className="h-[14px] w-[14px]" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
