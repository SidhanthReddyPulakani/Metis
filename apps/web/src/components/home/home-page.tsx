// components/home/home-page.tsx

import { HomeHeader } from "./home-header";
import { DatasetEntry } from "./dataset-entry";

export function HomePage() {
  return (
    <main className="min-h-screen">
      <HomeHeader />

      <section className="flex min-h-screen flex-col -translate-y-10 items-center justify-center ">
        <div className="text-center">
          <h1 className="text-[128px] mb-0 pb-0 leading-none text-[color:var(--metis-text)]">Metis</h1>

          <p className="mt-0 text-lg text-[color:var(--metis-text-secondary)]">
            Intelligence, Forged from Data.
          </p>
        </div>

        <DatasetEntry />
      </section>
    </main>
  );
}