import { createClient } from "@/lib/supabase/client"
import SearchItem from "./search-item";
import { useEffect, useState } from "react";

export default function WatchList() {

    const supabase = createClient();
    const [WL, setWL] = useState<SearchItem[] | null>([]);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            let { data: watchlists, error } = await supabase
                .from('watchlists')
                .select("*")
                .eq('uid', data.user?.id);
            const formatted = watchlists?.map((item) => ({
                imdbID: item.oid,
                Title: item.title,
                Year: item.year,
                Type: item.type,
                Poster: item.poster,
            }));
            console.log(formatted);
            setWL(formatted ? formatted : null);
        })()
    }, [])

    return (
        <div className="flex flex-row gap-4 flex-wrap justify-center">
            {!WL && <p>No results found...</p>}
            {WL && WL.map((result, index) => <SearchItem key={index} item={result} />)}
        </div>
    )
}