
export function MetisIntroPanel() {
  return (
    <section className="relative flex min-h-full flex-col justify-between overflow-hidden bg-[#472401] p-8 text-[#F7E1CB] sm:p-12 lg:p-16">
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full border border-[#F4CAA0]/50">
          <span className="text-xl">M</span>
        </div>

        <span className="text-sm font-medium uppercase tracking-[0.3em]">
          Metis
        </span>
      </div>

      <div className="relative z-10 my-16 max-w-xl">
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#F4CAA0]">
          Intelligence, Forged from Data.
        </p>

        <h2 className="text-4xl leading-tight font-medium sm:text-5xl lg:text-6xl">
          From raw data
          <br />
          to real intelligence.
        </h2>

        <p className="mt-7 max-w-md text-base leading-7 text-[#F7E1CB]/75 sm:text-lg">
          Explore your data, understand what matters, validate your
          approach, and forge machine learning models ready for the
          real world.
        </p>

        <div className="mt-10 space-y-4">
          <Feature
            number="01"
            title="Understand your data"
            description="Discover structure, patterns, and potential."
          />
          <Feature
            number="02"
            title="Build with intention"
            description="Prepare features and run meaningful experiments."
          />
          <Feature
            number="03"
            title="Move toward deployment"
            description="Turn validated models into useful systems."
          />
        </div>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#F7E1CB]/15 pt-5 text-xs text-[#F7E1CB]/55">
        <span>Explore. Understand. Train. Deploy.</span>
        <span>Built for the curious.</span>
      </footer>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 size-96 rounded-full border border-[#F4CAA0]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-[30%] size-64 rounded-full border border-[#F4CAA0]/10"
      />
    </section>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 border-t border-[#F7E1CB]/15 pt-4">
      <span className="pt-1 text-xs tracking-widest text-[#F4CAA0]">
        {number}
      </span>

      <div>
        <h3 className="text-sm font-medium text-[#F7E1CB] sm:text-base">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#F7E1CB]/60">
          {description}
        </p>
      </div>
    </div>
  );
}
