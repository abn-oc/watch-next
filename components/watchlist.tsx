"use client";

import { useContext } from "react";
import { WatchlistContext } from "@/lib/contexts/watchlist-context";
import SearchItem from "./search-item";
import { Film } from "lucide-react";

export default function WatchList() {
    const context = useContext(WatchlistContext);

    if (!context) {
        throw new Error('WatchList must be used within a WatchlistContext.Provider');
    }

    const { watchlists } = context;

    // Format the watchlist data to match the SearchItem type
    const formattedWatchlists = watchlists.map((item) => ({
        imdbID: item.oid,
        Title: item.title,
        Year: item.year,
        Type: item.type,
        Poster: item.poster,
    }));

    return (
        <div className="w-full">
            {!formattedWatchlists.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Film className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Your watchlist is empty</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Search for movies and TV shows to add them to your watchlist
                    </p>
                </div>
            ) : (
                <div className="flex justify-center w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {formattedWatchlists.map((item, index) => (
                            // @ts-expect-error - The item type is compatible with SearchItem props
                            <SearchItem key={index} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}