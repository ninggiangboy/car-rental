"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addHours, addMinutes, format, startOfDay } from "date-fns";

export default function TimePicker() {
  const initDate = addHours(startOfDay(new Date()), 6);
  const [time, setTime] = useState<Date>(initDate);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !time && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {time ? format(time, "HH:mm PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2 "
      >
        <Select
          onValueChange={(value) => {
            const newTime = new Date(value);
            setTime(newTime);
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={time ? format(time, "hh:mm a") : "Select time"}
            />
          </SelectTrigger>
          <SelectContent position="popper">
            {Array.from({ length: 24 * 2 }).map((_, i) => {
              const newTime = addMinutes(startOfDay(time), i * 30);
              return (
                <SelectItem key={i} value={newTime.toISOString()}>
                  {format(newTime, "hh:mm a")}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={time}
            onSelect={(newTime) => {
              newTime?.setHours(time?.getHours());
              newTime?.setMinutes(time?.getMinutes());
              newTime?.setSeconds(time?.getSeconds());
              setTime(newTime ? newTime : time);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
