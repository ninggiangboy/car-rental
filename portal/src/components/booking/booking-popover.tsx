import { Booking, BookingStatus } from '@/lib/defines';
import RatingModal from './rating-modal';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
    DotsHorizontalIcon,
    FaceIcon,
    PaperPlaneIcon,
    Pencil2Icon,
} from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import ViewRatingModal from './view-rating-modal';
import BookingAlertModal from './booking-alert-modal';
import Link from 'next/link';

export default function BookingPopover({ booking }: { booking: Booking }) {
    return (
        <div className="flex justify-end md:absolute md:top-5 md:right-5">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <DotsHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 m-0 p-1">
                    <div className="grid ">
                        <h4 className="leading-none px-2 py-1.5 text-sm font-semibold">
                            Action
                        </h4>
                        <Separator className="my-1 bg-slate-100" />
                        <div className="grid grid-cols-1 ">
                            <Link
                                href={`cars/${booking.carId}`}
                                className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                                <div>View detail</div>
                                <div>
                                    <Pencil2Icon className="mr-2" />
                                </div>
                            </Link>
                            {(booking.rentalStatus === BookingStatus.REJECTED ||
                                booking.rentalStatus ===
                                    BookingStatus.CANCELLED ||
                                booking.rentalStatus ===
                                    BookingStatus.COMPLETED) && (
                                <Link
                                    href={`/reservation?car=${booking.carId}`}
                                    className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                >
                                    <div>Rent again</div>
                                    <div>
                                        <PaperPlaneIcon className="mr-2" />
                                    </div>
                                </Link>
                            )}
                            {(booking.rentalStatus === BookingStatus.PENDING ||
                                booking.rentalStatus ===
                                    BookingStatus.CONFIRMED ||
                                booking.rentalStatus ===
                                    BookingStatus.PENDING_DEPOSIT ||
                                booking.rentalStatus ===
                                    BookingStatus.PENDING_PICKUP) && (
                                <BookingAlertModal
                                    message="Cancel Booking"
                                    messageDesc="Are you sure to cancel this booking? This action cannot be undone!"
                                    messageSuccess="Booking cancel successfully"
                                    messageError="Failed to cancel booking, please try again later."
                                    bookingId={booking.id}
                                />
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
