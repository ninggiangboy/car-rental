import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CounterClockwiseClockIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn, getDateFormatted } from "@/lib/utils";
import HoverTotalPrice from "./hover-total-price";
import CommentRating from "./comment-rating";
import { BookingListRecord, BookingStatus } from "@/lib/defines";
import StatusBadge from "../status-badge";

export default function ReportCard({
  booking,
}: {
  booking: BookingListRecord;
}) {
  const date = {
    from: new Date(booking.rentalStart),
    to: new Date(booking.rentalEnd),
  };

  const getTotalDays = (checkin: Date, checkout: Date): number => {
    const diffInMilliseconds = Math.abs(checkout.getTime() - checkin.getTime());
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  return (
    <div>
      <Card>
        <CardHeader className="items-start gap-4">
          <div className="flex justify-between w-full">
            <div>
              <StatusBadge status={booking.rentalStatus} />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CounterClockwiseClockIcon className="mr-1 h-4 w-4 " />
              {getDateFormatted(booking.createdAt)}
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div>
              <div className="p-0 h-[1.5rem] gap-3 text-slate-500 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
                <span>Deposit:</span>
                <span className="text-xl font-extrabold">
                  ${booking.deposit}
                </span>
              </div>
            </div>
            <HoverTotalPrice price={booking.totalPrice} rentalId={booking.id} />
          </div>

          <div className="flex justify-between w-full">
            {/* Begin booking date */}
            <div
              className={cn(
                "justify-start text-left font-normal cursor-default flex gap-2 items-center text-sm",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
            {/* End booking date */}
            <Badge variant="outline">
              {getTotalDays(
                new Date(booking.rentalStart),
                new Date(booking.rentalEnd)
              )}{" "}
              days
            </Badge>
          </div>
          <Separator />
          {/* Begin rating section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-4 items-center">
                <Avatar>
                  <AvatarImage src={booking.user.image} />
                  <AvatarFallback>{booking.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {booking.user.name || "No name"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {booking.user.phoneNumber || "No phone number"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 rounded-md text-secondary-foreground">
                {Array.from({ length: booking.rate }).map((_, index) => (
                  <StarFilledIcon
                    key={index}
                    className="h-5 w-5 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <CommentRating comment={booking.comment || ""} />
            </div>
          </div>
          {/* End rating section */}
        </CardHeader>
        {/* Begin more rating infor */}
        {booking.rate && (
          <CardContent>
            <div className="flex justify-end text-sm text-muted-foreground">
              <div className="flex items-center">
                Feedback at {getDateFormatted(booking.ratingTime)}
              </div>
            </div>
          </CardContent>
        )}

        {/* End more rating infor */}
      </Card>
    </div>
  );
}
