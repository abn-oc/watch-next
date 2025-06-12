import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ProfileButton } from "./profile-button";
import Image from 'next/image';

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("uid", user?.id);

  return user ? (
    <div className="flex items-center gap-4">
      {/* Hey, {user.email}! */}
      <Image
        src={profiles && profiles[0].avatar_url || "/default.jpg"}
        width={40}
        height={40}
        className="rounded-full object-cover"
        alt="avatar" />
      {profiles && profiles[0].username}
      <ProfileButton />
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
