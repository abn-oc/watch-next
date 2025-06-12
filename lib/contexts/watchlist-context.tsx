"use client";

import { createContext } from "react";

// Define types for our data
export type WatchlistItem = {
  uid: string;
  oid: string;
  poster: string;
  title: string;
  type: string;
  year: string;
};

export type WatchlistContextType = {
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