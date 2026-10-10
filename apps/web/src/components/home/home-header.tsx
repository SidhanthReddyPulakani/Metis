"use client";
// components/home/home-header.tsx
import { useRouter } from "next/navigation";

// Inside HomeHeader:
const router = useRouter();

export function HomeHeader() {
  return (
    <header>
      <button type="button" aria-label="Open navigation">
        {/* menu icon */}
      </button>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="bg-transparent border-none text-[#472401] hover:underline cursor-pointer"
      >
        Login
      </button>

      <div>
        {/* account / utility control */}
      </div>
    </header>
  );
}