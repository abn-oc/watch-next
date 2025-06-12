"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle, CardContent, CardFooter } from "./ui/card";
import { createClient } from "@/lib/supabase/client";
import { useContext } from "react";
import { WatchlistContext } from "@/lib/contexts/watchlist-context";
import Image from "next/image";

type prop = {
    item: SearchItem;
};

export default function SearchItem({ item }: prop) {
    const supabase = createClient();
    const context = useContext(WatchlistContext);
    
    if (!context) {
        throw new Error('SearchItem must be used within a WatchlistContext.Provider');
    }

    const { addToWatchlist, addToCompletedList, completedlists, watchlists } = context;

    const isInWatchlist = watchlists?.some(w => w.oid === item.imdbID);
    const isInCompletedList = completedlists?.some(c => c.oid === item.imdbID);

    const handleAddToWatchlist = async () => {
        if (isInWatchlist) return;
        const { data: userdata } = await supabase.auth.getUser();
        if (!userdata.user) return;

        const watchlistItem = {
            uid: userdata.user.id,
            oid: item.imdbID,
            poster: item.Poster,
            title: item.Title,
            type: item.Type,
            year: item.Year
        };

        await addToWatchlist(watchlistItem);
    };

    const handleAddToCompletedList = async () => {
        if (isInCompletedList) return;
        const { data: userdata } = await supabase.auth.getUser();
        if (!userdata.user) return;

        const completedItem = {
            uid: userdata.user.id,
            oid: item.imdbID,
            poster: item.Poster,
            title: item.Title,
            type: item.Type,
            year: item.Year
        };

        await addToCompletedList(completedItem);
    };

    return (
        <Card className="min-w-56 max-w-56">
            <CardContent className="flex flex-col gap-4 items-center">
                <Image
                    src={item.Poster}
                    alt={item.Title}
                    width={144}
                    height={216}
                    className="w-36 h-auto"
                />
                <div className="text-center">
                    <CardTitle>
                        <Link href={`/details/${item.imdbID}`}>{item.Title}</Link>
                    </CardTitle>
                    <CardDescription className="my-2">
                        {item.Type} &bull; {item.Year}
                    </CardDescription>
                </div>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="button"
                        className="w-full"
                        onClick={handleAddToWatchlist}
                        disabled={isInWatchlist}
                    >
                        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleAddToCompletedList}
                        disabled={isInCompletedList}
                    >
                        {isInCompletedList ? "Completed" : "Add to Completed List"}
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
