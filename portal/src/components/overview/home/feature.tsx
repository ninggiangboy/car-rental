import { Icons } from "@/components/icons";
import React from "react";

const features = [
  {
    icon: Icons.Sparkle,
    title: "Hassle-Free Booking",
    description:
      "Effortless booking process. Your perfect car, just a click away. Enjoy seamless reservations and unlock great deals instantly.",
  },
  {
    icon: Icons.ShieldCheck,
    title: "Secure Rentals",
    description:
      "Your safety assured. Rigorous checks, transparent policies, and comprehensive insurance. Travel worry-free with well-maintainedvehicles and reliable, secure rental services.",
  },
  {
    icon: Icons.NavigationArrow,
    title: "Easy Navigation",
    description:
      "Explore with confidence. User-friendly navigation tools to find your way, making your travels smooth and enjoyable, wherever your destination may be.",
  },
];

export default function Features() {
  return (
    <section className="border-t bg-neutral-50">
      <div className="mx-auto max-w-none px-5 py-14 sm:max-w-[90%] sm:px-0 lg:max-w-4xl">
        <h2 className="text-center text-2xl font-bold">
          Discover Why We Stand Out
        </h2>
        <div className="mt-12 grid grid-cols-1 items-center justify-center gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center md:items-start md:text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-white">
                {React.createElement(feature.icon, {
                  className: "h-6 w-6 text-neutral-500",
                })}
              </div>
              <p className="mt-6 font-semibold">{feature.title}</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
