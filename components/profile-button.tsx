"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ProfileButton() {
  const router = useRouter();

  const profile = async () => {
    const supabase = createClient();
    router.push("/profile");
  };

  return <Button onClick={profile}>Profile</Button>;
}
