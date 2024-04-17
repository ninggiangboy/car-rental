"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchParams } from "@/lib/defines";
import { createUrl } from "@/lib/utils";
import { Badge } from "../ui/badge";

const MIN_PRICE = 0;
const MAX_PRICE = 1000;
const MAX_FUEL_CONSUMPTION = 10;
const MIN_FUEL_CONSUMPTION = 0;
const seatingCapacity: ReadonlyArray<number | undefined> = [
  undefined,
  2,
  3,
  4,
  5,
  6,
  7,
];
const transmissions: ReadonlyArray<string> = ["AUTOMATIC", "MANUAL"];
const engineTypes: ReadonlyArray<string> = ["ELECTRIC", "GASOLINE", "DIESEL"];
export default function FilterModal() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [fuelRange, setFuelRange] = useState([
    MIN_FUEL_CONSUMPTION,
    MAX_FUEL_CONSUMPTION,
  ]);
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [noSeats, setNoSeats] = useState<number | undefined>(0);
  const [selectedTransmission, setSelectedTransmission] = useState<
    string | undefined
  >();
  const [selectedEngineType, setSelectedEngineType] = useState<
    string | undefined
  >();
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const minPrice = searchParams.get(SearchParams.MIN_PRICE);
    const maxPrice = searchParams.get(SearchParams.MAX_PRICE);
    const noSeats = searchParams.get(SearchParams.NO_SEATS);
    const minFuel = searchParams.get(SearchParams.MIN_FUEL);
    const maxFuel = searchParams.get(SearchParams.MAX_FUEL);
    const transmission = searchParams.get(SearchParams.TRANSMISSION);
    const engineType = searchParams.get(SearchParams.ENGINE_TYPE);
    setFuelRange([
      parseInt(minFuel ?? MIN_FUEL_CONSUMPTION.toString()),
      parseInt(maxFuel ?? MAX_FUEL_CONSUMPTION.toString()),
    ]);
    setPriceRange([
      parseInt(minPrice ?? MIN_PRICE.toString()),
      parseInt(maxPrice ?? MAX_PRICE.toString()),
    ]);
    if (!noSeats) setNoSeats(undefined);
    else setNoSeats(parseInt(noSeats));
    setSelectedTransmission(transmission ?? undefined);
    setSelectedEngineType(engineType ?? undefined);
  }, [searchParams]);

  const handleSubmit = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(SearchParams.MIN_PRICE);
    newParams.delete(SearchParams.MAX_PRICE);
    newParams.delete(SearchParams.NO_SEATS);
    newParams.delete(SearchParams.PAGE);
    newParams.delete(SearchParams.TRANSMISSION);
    newParams.delete(SearchParams.ENGINE_TYPE);
    newParams.delete(SearchParams.MIN_FUEL);
    newParams.delete(SearchParams.MAX_FUEL);
    if (priceRange[0] != MIN_PRICE)
      newParams.set(SearchParams.MIN_PRICE, priceRange[0].toString());
    if (priceRange[1] != MAX_PRICE)
      newParams.set(SearchParams.MAX_PRICE, priceRange[1].toString());
    if (fuelRange[0] != MIN_FUEL_CONSUMPTION)
      newParams.set(SearchParams.MIN_FUEL, fuelRange[0].toString());
    if (fuelRange[1] != MAX_FUEL_CONSUMPTION)
      newParams.set(SearchParams.MAX_FUEL, fuelRange[1].toString());
    if (noSeats) newParams.set(SearchParams.NO_SEATS, noSeats.toString());
    if (selectedTransmission)
      newParams.set(
        SearchParams.TRANSMISSION,
        selectedTransmission.toUpperCase(),
      );
    if (selectedEngineType)
      newParams.set(SearchParams.ENGINE_TYPE, selectedEngineType.toUpperCase());
    setSelected(
      (priceRange[0] != MIN_PRICE ? 1 : 0) +
        (priceRange[1] != MAX_PRICE ? 1 : 0) +
        (fuelRange[0] != MIN_FUEL_CONSUMPTION ? 1 : 0) +
        (fuelRange[1] != MAX_FUEL_CONSUMPTION ? 1 : 0) +
        (noSeats ? 1 : 0) +
        (selectedTransmission ? 1 : 0) +
        (selectedEngineType ? 1 : 0),
    );
    push(createUrl("/cars", newParams));
  };

  const handleReset = () => {
    setNoSeats(undefined);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedTransmission(undefined);
    setSelectedEngineType(undefined);
    setFuelRange([MIN_FUEL_CONSUMPTION, MAX_FUEL_CONSUMPTION]);
  };

  return (
    <div className="flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MixerHorizontalIcon className="mr-2 size-4" /> Filter{" "}
            {selected > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selected}
                </Badge>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <section>
            <h3 className="pb-6 text-xl font-semibold">Price range</h3>
            <div className="mx-auto flex max-w-[600px] flex-col items-start justify-between  pt-2">
              <Slider
                value={[priceRange[0] ?? MIN_PRICE, priceRange[1] ?? MAX_PRICE]}
                onValueChange={(values) => setPriceRange(values)}
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1}
                minStepsBetweenThumbs={10}
              />
              <div className="flex w-full items-center justify-between gap-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="minPrice"
                    readOnly
                    value={`$ ${priceRange[0]}`}
                    placeholder="Min Price"
                  />
                </div>
                <Separator
                  decorative
                  orientation="horizontal"
                  className="shrink-0 basis-4 border-neutral-400"
                />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="maxPrice"
                    readOnly
                    value={
                      priceRange[1] == 1000 ? "No limit" : `$ ${priceRange[1]}`
                    }
                    placeholder="Max Price"
                  />
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="pb-6 text-xl font-semibold">
              Fuel consumption range
            </h3>
            <div className="mx-auto flex max-w-[600px] flex-col items-start justify-between  pt-2">
              <Slider
                value={[
                  fuelRange[0] ?? MIN_FUEL_CONSUMPTION,
                  fuelRange[1] ?? MAX_FUEL_CONSUMPTION,
                ]}
                onValueChange={(values) => setFuelRange(values)}
                min={MIN_FUEL_CONSUMPTION}
                max={MAX_FUEL_CONSUMPTION}
                step={0.1}
                minStepsBetweenThumbs={1}
              />
              <div className="flex w-full items-center justify-between gap-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="minPrice"
                    readOnly
                    value={`${fuelRange[0]} L/100km`}
                    placeholder="Min Fuel consumption"
                  />
                </div>
                <Separator
                  decorative
                  orientation="horizontal"
                  className="shrink-0 basis-4 border-neutral-400"
                />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="maxPrice"
                    readOnly
                    value={
                      fuelRange[1] == MAX_FUEL_CONSUMPTION
                        ? "No limit"
                        : `${fuelRange[1]} L/100km`
                    }
                    placeholder="Max Fuel consumption"
                  />
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="pb-6 text-xl font-semibold">Seating capacity</h3>
            <div className="mb-2 flex flex-row flex-wrap items-center gap-3">
              {seatingCapacity.map((seats, index, array) => {
                const isSelected = noSeats === seats;

                return (
                  <Button
                    key={seats ?? "any"}
                    variant={isSelected ? "default" : "outline"}
                    className="w-16 rounded-md"
                    onClick={() => setNoSeats(seats)}
                  >
                    {seats === undefined
                      ? "Any"
                      : index === array.length - 1
                        ? `${seats} +`
                        : seats}
                  </Button>
                );
              })}
            </div>
          </section>
          <div className="grid md:grid-cols-2 grid-cols-1">
            <section>
              <h3 className="pb-6 text-xl font-semibold">Transmissions</h3>
              <div className="mb-2 flex flex-row flex-wrap items-center gap-3">
                {transmissions.map((transmission, index) => {
                  return (
                    <Button
                      key={transmission}
                      variant={
                        selectedTransmission?.includes(transmission)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => {
                        selectedTransmission === transmission
                          ? setSelectedTransmission(undefined)
                          : setSelectedTransmission(transmission);
                      }}
                      className="w-28 rounded-md"
                    >
                      {transmission}
                    </Button>
                  );
                })}
              </div>
            </section>
            <section>
              <h3 className="pb-6 text-xl font-semibold">Engine Types</h3>
              <div className="mb-2 flex flex-row flex-wrap items-center gap-3">
                {engineTypes.map((engineType, index) => {
                  return (
                    <Button
                      key={engineType}
                      variant={
                        selectedEngineType == engineType ? "default" : "outline"
                      }
                      onClick={() => {
                        selectedEngineType === engineType
                          ? setSelectedEngineType(undefined)
                          : setSelectedEngineType(engineType);
                      }}
                      className="w-24 rounded-md"
                    >
                      {engineType}
                    </Button>
                  );
                })}
              </div>
            </section>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <DialogClose asChild>
              <Button onClick={handleSubmit}>Apply</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
