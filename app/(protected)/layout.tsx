"use client";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WatchlistContext, WatchlistItem } from "@/lib/contexts/watchlist-context";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([]);
  const [completedlists, setCompletedlists] = useState<WatchlistItem[]>([]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const { data: userdata } = await supabase.auth.getUser();
      if (!userdata.user) return;

      // Fetch watchlists
      const { data: watchlistsData } = await supabase
        .from('watchlists')
        .select("*")
        .eq('uid', userdata.user.id);
      
      // Fetch completed lists
      const { data: completedlistsData } = await supabase
        .from('completedlists')
        .select("*")
        .eq('uid', userdata.user.id);

      setWatchlists(watchlistsData || []);
      setCompletedlists(completedlistsData || []);
    };

    fetchData();
  }, [supabase]);

  // Database sync functions
  const addToWatchlist = async (item: WatchlistItem) => {
    const { error } = await supabase
      .from('watchlists')
      .insert([item])
      .select();

    if (!error) {
      setWatchlists(prev => [...prev, item]);
    }
  };

  const addToCompletedList = async (item: WatchlistItem) => {
    const { error } = await supabase
      .from('completedlists')
      .insert([item])
      .select();

    if (!error) {
      setCompletedlists(prev => [...prev, item]);
    }
  };

  const removeFromWatchlist = async (oid: string) => {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('oid', oid);

    if (!error) {
      setWatchlists(prev => prev.filter(item => item.oid !== oid));
    }
  };

  const removeFromCompletedList = async (oid: string) => {
    const { error } = await supabase
      .from('completedlists')
      .delete()
      .eq('oid', oid);

    if (!error) {
      setCompletedlists(prev => prev.filter(item => item.oid !== oid));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center">
              <Link 
                href={"/home"} 
                className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Watch Next
              </Link>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
              </div>
            </div>
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          <WatchlistContext.Provider value={{
            watchlists,
            setWatchlists,
            completedlists,
            setCompletedlists,
            addToWatchlist,
            addToCompletedList,
            removeFromWatchlist,
            removeFromCompletedList
          }}>
            {children}
          </WatchlistContext.Provider>
        </div>
      </div>
    </main>
  );
}
