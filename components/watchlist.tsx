"use client";

import { useContext } from "react";
import { WatchlistContext } from "@/app/(protected)/layout";
import SearchItem from "./search-item";

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
        <div className="flex flex-row gap-4 flex-wrap justify-center">
            {!formattedWatchlists.length && <p>No items in watchlist...</p>}
            {formattedWatchlists.map((item, index) => (
                // @ts-ignore
                <SearchItem key={index} item={item} />
            ))}
        </div>
    );
}