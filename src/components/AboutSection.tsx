import Link from "next/link";
import Image from "next/image";
import { studioImages } from "@/lib/studioImages";

export default function AboutSection() {
  return (
    <section className="bg-ivory px-6 py-16 text-ink sm:px-10">
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          <Image
            src={studioImages.wallet}
            alt="A leather piece from Atlantic Leather"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-4xl">About the house</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-ink/75">
            Atlantic Leather works in Tatek Industrial Zone, Sheger City. The collection is genuine Ethiopian leather, made to order by the bench that has dressed the house since 2006.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex bg-carmine px-6 py-3 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-ink"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
