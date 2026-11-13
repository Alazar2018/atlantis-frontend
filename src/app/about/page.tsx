import Image from "next/image";
import ProductCategories from "@/components/ProductCategories";
import { studioImages } from "@/lib/studioImages";

const values = [
  { title: "Sustainability", copy: "The hide is used fully. Waste is a failure of the pattern, not a cost of doing business." },
  { title: "Craft", copy: "The bench still sets the standard. Machines help. The hand decides when a piece is finished." },
  { title: "Community", copy: "The workshop in Sheger City employs the people who know this leather best." },
  { title: "Integrity", copy: "What we say the hide is, the hide is. No coated shortcuts dressed as grain." },
];

const milestones = [
  { year: "2006", title: "The house opens", copy: "A small bench in Ethiopia, making footwear that could be worn hard." },
  { year: "2010", title: "The rail widens", copy: "Bags, belts, and small goods join the shoes." },
  { year: "2015", title: "Tatek", copy: "The workshop moves to Tatek Industrial Zone and the making gets room to breathe." },
  { year: "2020", title: "Beyond the city", copy: "The name travels. The standard stays in the same hands." },
  { year: "2024", title: "Eighteen years", copy: "Still cutting Ethiopian leather, still answering for every stitch." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <section className="bg-carmine px-6 pb-16 pt-32 text-ivory sm:px-10">
        <div className="mx-auto max-w-[90rem]">
          <h1 className="font-display text-4xl md:text-5xl">About Atlantic Leather</h1>
          <p className="mt-4 max-w-xl text-ivory/85">
            A workshop in Sheger City, making Ethiopian leather since 2006.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src={studioImages.bag}
              alt="Handcrafted Atlantic Leather bag"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">Origin</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95]">The name is a promise.</h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-ink/75">
              Since 2006 the house has treated Ethiopian leather as a craft to continue, not a trend to borrow. The name stands for learning, growth, and a refusal to let the hide be anonymous.
            </p>
            <p className="mt-4 text-lg font-light leading-relaxed text-ink/75">
              Heritage is the method. Quality, integrity, and a careful kind of invention are the rules the bench still uses.
            </p>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="bg-ink px-6 py-16 text-ivory sm:px-12 lg:px-16 lg:py-24">
          <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">Vision</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Leather that outlasts the season it was bought in.</h2>
          <p className="mt-6 max-w-lg font-light leading-relaxed text-ivory/75">
            To be the house people name when they want Ethiopian leather made properly — for the foot, the shoulder, and the desk.
          </p>
        </div>
        <div className="bg-oxblood px-6 py-16 text-ivory sm:px-12 lg:px-16 lg:py-24">
          <p className="text-[11px] uppercase tracking-[0.35em] text-ivory/80">Mission</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Cut it true. Finish it by hand. Stand behind it.</h2>
          <p className="mt-6 max-w-lg font-light leading-relaxed text-ivory/85">
            We make shoes, bags, belts, gloves, and the pieces companies ask us to mark. The same bench. The same hide. No second quality hiding behind a logo.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-[90rem]">
          <h2 className="font-display text-3xl md:text-4xl">What we stand for</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article key={value.title}>
                <h3 className="text-xl font-medium">{value.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink/70">{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-16 text-ivory sm:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-carmine">The years</p>
          <h2 className="mt-4 font-display text-5xl">A short history of the bench.</h2>
          <ol className="mt-12 space-y-10 border-l border-carmine/60 pl-8">
            {milestones.map((item) => (
              <li key={item.year}>
                <p className="font-display text-3xl text-carmine">{item.year}</p>
                <h3 className="mt-1 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 font-light text-ivory/75">{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProductCategories />
    </div>
  );
}
