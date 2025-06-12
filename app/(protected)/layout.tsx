"use client";

import { DeployButton } from "@/components/deploy-button";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Define types for our data
type WatchlistItem = {
  uid: string;
  oid: string;
  poster: string;
  title: string;
  type: string;
  year: string;
};

type WatchlistContextType = {
  watchlists: WatchlistItem[];
  setWatchlists: React.Dispatch<React.SetStateAction<WatchlistItem[]>>;
  completedlists: WatchlistItem[];
  setCompletedlists: React.Dispatch<React.SetStateAction<WatchlistItem[]>>;
  addToWatchlist: (item: WatchlistItem) => Promise<void>;
  addToCompletedList: (item: WatchlistItem) => Promise<void>;
  removeFromWatchlist: (oid: string) => Promise<void>;
  removeFromCompletedList: (oid: string) => Promise<void>;
};

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

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
  }, []);

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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/home"}>Watch Next</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
                <ThemeSwitcher />
              </div>
            </div>
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
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
