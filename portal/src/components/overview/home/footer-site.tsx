import { siteConfig } from "@/config/site";
import LogoSite from "@/components/overview/logo-site";

const footerLinks = [
  {
    title: "Destinations",
    links: [
      "Beach Escapes",
      "Historical Trails",
      "Foodie Journeys",
      "Urban Explorations",
      "Wildlife Safaris",
      "Photography Tours",
    ],
  },
  {
    title: "Resources",
    links: [
      "Blog",
      "Car Rental Tips",
      "Travel Insights",
      "Safety Guides",
      "Car Models Guide",
    ],
  },
  {
    title: "Policies",
    links: ["Privacy", "Terms of use", "Cookie Preferences"],
  },
  { title: "Support", links: ["Contact us", "FAQs"] },
];

export default function FooterSite() {
  const url = siteConfig.url;

  return (
    <footer className="border-t bg-white py-10">
      <div className="mx-auto w-full max-w-none px-5 text-sm sm:max-w-[90%] sm:px-0 2xl:max-w-7xl">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] items-stretch justify-between gap-x-2 gap-y-10 sm:gap-x-6 md:flex md:flex-wrap">
          <div className="col-span-full">
            <LogoSite />
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              <h3 className="mb-1 text-sm font-medium text-neutral-800 lg:text-sm">
                {section.title}
              </h3>
              {section.links.map((link) => (
                <a
                  key={link}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-600 hover:text-black"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
