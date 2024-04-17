import Image from "next/image";

const feedbacks = [
  {
    comment:
      "Reliable and Affordable! I've used several car rental websites before, but this one stands out. The prices are transparent, no hidden fees, and the cars are well-maintained. I'll be coming back for all my future trips.",
    image_url: "/feedback/avatar.jpeg",
    name: "Sophia Rodriguez",
    username: "sophiarodriguez",
  },
  {
    comment:
      "Best Car Rental Experience! The website's interface is intuitive, making it easy to find the ideal car. The reviews from other users were incredibly helpful, and the entire process, from booking to return.",
    image_url: "/feedback/avatar.jpeg",
    name: "Sophia Rodriguez",
    username: "sophiarodriguez",
  },
  {
    comment:
      "A Seamless Experience! This website made renting a car hassle-free. The search filters helped me find the perfect car for my trip, and the customer support was responsive and friendly.",
    image_url: "/feedback/avatar.jpeg",
    name: "Sophia Rodriguez",
    username: "sophiarodriguez",
  },
  {
    comment:
      "Exceptional Service! From booking to drop-off, everything was smooth and easy. The selection of cars was impressive, and the prices were unbeatable. Will definitely recommend to friends!",
    image_url: "/feedback/avatar.jpeg",
    name: "Sophia Rodriguez",
    username: "sophiarodriguez",
  },
];

export default function Feedbacks() {
  return (
    <section className="border-t py-12">
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <h2 className="text-center text-2xl font-bold">Driven by Feedback</h2>
        <div className="mt-4 columns-1 sm:columns-2 lg:columns-4">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="pt-4">
              <figure className="rounded-2xl bg-neutral-50 p-8">
                <blockquote className="text-sm leading-6 text-neutral-700">
                  “{feedback.comment}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-start gap-5">
                  <Image
                    src={feedback.image_url}
                    alt={feedback.name}
                    height={40}
                    width={40}
                    className="h-10 w-10 rounded-full border bg-white object-cover object-center"
                  />
                  <div>
                    <p className="text-sm font-semibold">{feedback.name}</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      @{feedback.username}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
