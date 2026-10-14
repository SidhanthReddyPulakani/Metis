import { AuthPanel } from "@/components/auth/auth-panel";
import { MetisIntroPanel } from "@/components/auth/metis-intro-panel";

export default function LoginPage() {
  return (
    <main className="h-full min-h-0 min-w-0 overflow-hidden bg-[#F7E1CB]">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 lg:grid-cols-12">
        <div className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden px-4 sm:px-6 lg:col-span-5 lg:px-8 xl:px-12">
          <AuthPanel />
        </div>

        <div className="hidden min-h-0 min-w-0 lg:col-span-7 lg:block">
          <MetisIntroPanel />
        </div>

        <div className="min-h-0 min-w-0 overflow-hidden lg:hidden">
          <MetisIntroPanel />
        </div>
      </div>
    </main>
  );
}