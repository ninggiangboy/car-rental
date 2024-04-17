import { fetchUserRentalInfo } from "@/lib/actions";
import { UserRentalInfo } from "@/lib/defines";
import { getDateFormatted } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import UserRentalInfoLoading from "../loading/pending-request/user-rental-info-loading";

export default function UserAnalysis({ userId }: { userId: string }) {
  const [info, setInfo] = useState<UserRentalInfo | undefined>();
  useEffect(() => {
    setTimeout(
      () =>
        fetchUserRentalInfo(userId).then((data) => {
          setInfo(data);
        }),
      500,
    );
  }, [userId]);

  if (!info) {
    return <UserRentalInfoLoading />;
  }

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex flex-col gap-2 text-center">
        <span className="font-semibold">Total Completed Rides</span>
        <span>{info.totalCompletedRides}</span>
      </div>
      <div className="flex flex-col gap-2 text-center">
        <span className="font-semibold">Rate completed</span>
        <span>{info.rateCompletedRent.toFixed(2)}%</span>
      </div>
      <div className="flex flex-col gap-2 text-center">
        <span className="font-semibold">Last rent</span>
        <span>{format(info.lastRent, "PPP")}</span>
      </div>
    </div>
  );
}
