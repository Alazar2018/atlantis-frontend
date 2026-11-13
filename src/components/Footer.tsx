import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-champagne">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sand">Atlantic Leather</p>
          <p className="mt-4 max-w-md text-2xl leading-snug">
            Cut in Ethiopia. Worn everywhere.
          </p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-sand">Index</p>
          <ul className="mt-4 space-y-2 text-sm font-light text-champagne/80">
            <li><Link href="/products" className="hover:text-champagne">Collection</Link></li>
            <li><Link href="/about" className="hover:text-champagne">The house</Link></li>
            <li><Link href="/services" className="hover:text-champagne">Atelier</Link></li>
            <li><Link href="/contact" className="hover:text-champagne">Visit</Link></li>
            <li><Link href="/cart" className="hover:text-champagne">Bag</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-sand">Atelier</p>
          <ul className="mt-4 space-y-2 text-sm font-light text-champagne/80">
            <li>Tatek Industry Zone, Sheger City</li>
            <li>
              <a href="tel:+251963666646" className="hover:text-champagne">+251 963 666646</a>
            </li>
            <li>
              <a href="mailto:info@atlanticleather.com" className="hover:text-champagne">
                info@atlanticleather.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-champagne/15 px-6 py-6 text-[11px] uppercase tracking-[0.22em] text-champagne/50 sm:px-10">
        © {new Date().getFullYear()} Atlantic Leather · Established 2006
      </div>
    </footer>
  );
}
