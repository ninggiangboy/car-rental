import Features from "@/components/overview/home/feature";
import FeatureLocations from "@/components/overview/home/feature-locations";
import Feedbacks from "@/components/overview/home/feedback";
import Hero from "@/components/overview/home/hero";
import React from "react";

export default async function CustomerPage() {
  return (
    <>
      <Hero />
      <FeatureLocations />
      <Features />
      <Feedbacks />
    </>
  );
}
