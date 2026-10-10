
import { AuthPanel } from "@/components/auth/auth-panel";
import { MetisIntroPanel } from "@/components/auth/metis-intro-panel";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7E1CB]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:col-span-5 lg:px-12 xl:px-16">
          <AuthPanel />
        </div>

        <div className="hidden lg:block lg:col-span-7">
          <MetisIntroPanel />
        </div>

        <div className="lg:hidden">
          <MetisIntroPanel />
        </div>
      </div>
    </main>
  );
}
