"use client";

import { useContext } from "react";
import { WatchlistContext } from "@/app/(protected)/layout";
import SearchItem from "./search-item";

export default function CompletedList() {
    const context = useContext(WatchlistContext);
    
    if (!context) {
        throw new Error('WatchList must be used within a WatchlistContext.Provider');
    }
    
    const { completedlists } = context;

    // Format the watchlist data to match the SearchItem type
    const formattedCompletedlists = completedlists.map((item) => ({
        imdbID: item.oid,
        Title: item.title,
        Year: item.year,
        Type: item.type,
        Poster: item.poster,
    }));

    return (
        <div className="flex flex-row gap-4 flex-wrap justify-center">
            {!formattedCompletedlists.length && <p>No items in completedlist...</p>}
            {formattedCompletedlists.map((item, index) => (
                // @ts-ignore
                <SearchItem key={index} item={item} />
            ))}
        </div>
    );
}