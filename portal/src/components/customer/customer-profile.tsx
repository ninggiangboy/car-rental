"use client";

import * as React from "react";

import { fetchCustomerProfile } from "@/lib/actions";
import { Statistics } from "./[id]/profile/statistics";
import Image from "next/image";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Car, CustomerProfile } from "@/lib/defines";
import CarCard from "../cars/car-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getDateFormatted } from "@/lib/utils";
import { ClockIcon, RocketIcon, StarIcon } from "@radix-ui/react-icons";
import carOwner from "../cars/car-detail/car-owner";
import { custom } from "zod";

export const About = ({ id }: { id: string }) => {
  const [customer, setCustomer] = React.useState({} as CustomerProfile);
  fetchCustomerProfile(id)
    .then((data) => {
      setCustomer(data);
    })
    .catch((err) => <div>DCM</div>);
};
