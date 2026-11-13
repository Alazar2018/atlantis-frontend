const notes = [
  { title: "Hand cut", description: "Finished by the same bench that has worked this leather since 2006." },
  { title: "Full grain", description: "The hide is what we say it is. No coated shortcut." },
  { title: "Made in Tatek", description: "Cut in Sheger City, at Tatek Industrial Zone." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-ink px-6 py-16 text-ivory sm:px-10">
      <div className="mx-auto max-w-[90rem]">
        <h2 className="font-display text-3xl md:text-4xl">Why Atlantic Leather</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {notes.map((note) => (
            <article key={note.title}>
              <h3 className="font-display text-2xl text-carmine">{note.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">{note.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
