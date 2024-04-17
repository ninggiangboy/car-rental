import CarExplorer from "@/components/overview/home/car-explorer";
import React from "react";
import Feedbacks from "@/components/overview/home/feedback";
import Hero from "@/components/overview/home/hero";
import FeatureLocations from "@/components/overview/home/feature-locations";
import Features from "@/components/overview/home/feature";

export default async function CarOwnerPage() {
  return (
    <>
      <CarExplorer />
      <Hero />
      <FeatureLocations />
      <Features />
      <Feedbacks />
    </>
  );
}
