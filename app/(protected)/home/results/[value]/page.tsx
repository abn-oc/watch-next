"use client"
import CompletedList from "@/components/completedlist";
import SearchItem from "@/components/search-item";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WatchList from "@/components/watchlist";
import { Search as SearchIcon } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Results() {

    const router = useRouter();
    const params: string = String(useParams().value);
    const [value, setValue] = useState<string>(decodeURIComponent(params));
    const [results, setResults] = useState<SearchItem[]>([]);

    async function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/home/results/${encodeURIComponent(value)}`);
    }

    useEffect(() => {
        (async () => {
            const apikey: string | undefined = process.env.NEXT_PUBLIC_OMDB_API_KEY;
            const results: SearchItem[] = (await (await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${value}`)).json()).Search;
            setResults(results);
        })()
    }, [value])

    return (
        <Tabs defaultValue="search" className="items-center flex flex-col gap-8">

            <TabsList>
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="watchlist">Watch List</TabsTrigger>
                <TabsTrigger value="completedlist">Completed List</TabsTrigger>
            </TabsList>

            {/* Use Tabs content to  */}
            <TabsContent value="search" className="flex flex-col gap-8 items-center">

                {/* searchbar */}
                <div className="relative w-96">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <form onSubmit={handleSearch}>
                        <Input
                            type="text"
                            placeholder="Search"
                            className="pl-10 bg-neutral-50 text-black"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                    </form>
                </div>

                {/* test result */}
                <div className="flex flex-row gap-4 flex-wrap justify-center">
                    {!results && <p>No results found...</p>}
                    {results && results.map((result, index) => <SearchItem key={index} item={result} />)}
                </div>

            </TabsContent>

                  <TabsContent value="watchlist">
                    <WatchList />
                  </TabsContent>
            
                  <TabsContent value="completedlist">
                    <CompletedList />
                  </TabsContent>

        </Tabs>
    )
}