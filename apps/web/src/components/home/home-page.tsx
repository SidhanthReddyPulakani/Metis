
import { HomeHeader } from "./home-header";
import { DatasetEntry } from "./dataset-entry";

export function HomePage() {
  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <HomeHeader />

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4">
        <div className="shrink-0 text-center">
          <h1 className="mb-0 pb-0 text-7xl leading-none text-[color:var(--metis-text)] sm:text-8xl lg:text-[128px]">
            Metis
          </h1>

          <p className="mt-0 text-base text-[color:var(--metis-text-secondary)] sm:text-lg">
            Intelligence, Forged from Data.
          </p>
        </div>

        <DatasetEntry />
      </section>
    </main>
  );
}
