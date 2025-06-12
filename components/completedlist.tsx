import { createClient } from "@/lib/supabase/client"
import SearchItem from "./search-item";
import { useEffect, useState } from "react";

export default function CompletedList() {

    const supabase = createClient();
    const [CL, setCL] = useState<SearchItem[] | null>([]);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            let { data: completedlists, error } = await supabase
                .from('completedlists')
                .select("*")
                .eq('uid', data.user?.id);
            const formatted = completedlists?.map((item) => ({
                imdbID: item.oid,
                Title: item.title,
                Year: item.year,
                Type: item.type,
                Poster: item.poster,
            }));
            console.log(formatted);
            setCL(formatted ? formatted : null);
        })()
    }, [])

    return (
        <div className="flex flex-row gap-4 flex-wrap justify-center">
            {!CL && <p>No results found...</p>}
            {CL && CL.map((result, index) => <SearchItem key={index} item={result} />)}
        </div>
    )
}