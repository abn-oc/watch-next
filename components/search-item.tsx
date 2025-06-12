import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle, CardContent, CardAction, CardFooter } from "./ui/card";
import { createClient } from "@/lib/supabase/client";

type prop = {
    item: SearchItem;
};

export default function SearchItem({ item }: prop) {

    const supabase = createClient();
    
    async function addtoWatchList() {
        const { data: userdata } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('watchlists')
            .insert([
                { uid: userdata.user?.id, oid: item.imdbID, poster: item.Poster, title: item.Title, type: item.Type, year: item.Year },
            ])
            .select()
        if (error) {
            console.log(error);
        }
        else {
            console.log("added to watchlist");
        }
    }

        async function addtoCompletedList() {
        const { data: userdata } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('completedlists')
            .insert([
                { uid: userdata.user?.id, oid: item.imdbID, poster: item.Poster, title: item.Title, type: item.Type, year: item.Year },
            ])
            .select()
        if (error) {
            console.log(error);
        }
        else {
            console.log("added to completedlist");
        }
    }

    return (
        <Card className="min-w-56 max-w-56">
            <CardContent className="flex flex-col gap-4 items-center">
                <img
                    src={item.Poster}
                    alt={item.Title}
                    className="w-36 h-auto"
                />
                <div className="text-center">
                    <CardTitle><Link href={`/details/${item.imdbID}`}>{item.Title}</Link></CardTitle>
                    <CardDescription className="my-2">
                        {item.Type} &bull; {item.Year}
                    </CardDescription>
                </div>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={addtoWatchList}>
                        add to watch list
                    </Button>
                    <Button variant="outline" className="w-full" onClick={addtoCompletedList}>
                        add to completed list
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
