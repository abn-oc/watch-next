"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { ProfileButton } from "./profile-button";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';

type Profile = {
  uid: string;
  username: string;
  avatar_url: string;
  bio: string;
};

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .eq("uid", user.id);
        setProfile(profiles?.[0]);
      }
    };

    getUser();
  }, [supabase]);

  return user ? (
    <div className="flex items-center gap-4">
      {/* Hey, {user.email}! */}
      <Image
        src={profile?.avatar_url || "/default.jpg"}
        width={40}
        height={40}
        className="rounded-full object-cover"
        alt="avatar" />
      {profile?.username}
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
