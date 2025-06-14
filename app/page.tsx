import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/home');
  }

  return (
    <main className="sm:min-h-screen min-h-[90vh] flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link 
                href={"/"} 
                className=" text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:opacity-50 transition-opacity"
              >
                Watch Next
              </Link>
              <div className="flex items-center gap-2">
                <ThemeSwitcher/>
              </div>
            </div>
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
        </div>
      </div>
    </main>
  );
}
