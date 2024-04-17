import { CarDetailInfo } from '@/lib/defines';

export default function CarTermOfUse({
    car,
}: Readonly<{ car: CarDetailInfo }>) {
    return (
        <div>
            <div>
                <div className="flex gap-10">
                    <div className="flex flex-col gap-10">
                        <span className="text-sm font-bold text-neutral-600  leading-none">
                            Base price:
                        </span>
                        <span className="text-sm font-bold text-neutral-600  leading-none">
                            Required deposit:
                        </span>
                    </div>
                    <div className="flex flex-col gap-10">
                        <span className="text-sm font-medium text-neutral-600  leading-none">
                            {`${car.basePrice} $`}
                        </span>
                        <span className="text-sm font-medium text-neutral-600  leading-none">
                            {car.deposit == 0
                                ? 'No require'
                                : `${car.deposit} $`}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-[2.5rem]">
                <div className="mb-5">
                    <div>
                        <span className="text-sm font-bold text-neutral-600  leading-none">
                            Term of use:
                        </span>
                    </div>
                    <div className="mt-3 w-full md:w-[70%]">
                        <span className="text-sm font-medium text-neutral-600">
                            {car.termOfUse}
                        </span>
                    </div>
                </div>

                {/* <div className="flex flex-col gap-5 justify-start sm:flex-row lg:gap-[10rem] sm:gap-20 mt-2">
                    <div className="flex gap-5 sm:gap-10 flex-col">
                        {termOfUse.slice(0, 3).map(term => (
                            <div className="flex gap-2" key={term.id}>
                                <Checkbox
                                    id={term.name}
                                    checked
                                    aria-readonly
                                />
                                <label
                                    htmlFor={term.name}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {term.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-5 sm:gap-10 flex-col">
                        {termOfUse.slice(3, 6).map(term => (
                            <div className="flex gap-2" key={term.name}>
                                <Checkbox
                                    id={term.name}
                                    checked
                                    aria-readonly
                                />
                                <label
                                    htmlFor={term.name}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {term.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-5 sm:gap-10 flex-col">
                        {termOfUse.slice(6).map(term => (
                            <div className="flex gap-2" key={term.name}>
                                <Checkbox
                                    id={term.name}
                                    checked
                                    aria-readonly
                                />
                                <label
                                    htmlFor={term.name}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {term.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    );
}
