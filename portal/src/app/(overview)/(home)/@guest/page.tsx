import Features from "@/components/overview/home/feature";
import Feedbacks from "@/components/overview/home/feedback";
import Hero from "@/components/overview/home/hero";
import React from "react";
import FeatureLocations from "@/components/overview/home/feature-locations";

export default async function GuestPage() {
  return (
    <>
      <Hero />
      <FeatureLocations />
      <Features />
      <Feedbacks />
    </>
  );
}
