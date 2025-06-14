"use client"
import CompletedList from "@/components/completedlist";
import SearchItem from "@/components/search-item";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WatchList from "@/components/watchlist";
import { Search as SearchIcon, SearchX } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Results() {
    const router = useRouter();
    const params: string = String(useParams().value);
    const [value, setValue] = useState<string>(decodeURIComponent(params));
    const [results, setResults] = useState<SearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/home/results/${encodeURIComponent(value)}`);
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const apikey: string | undefined = process.env.NEXT_PUBLIC_OMDB_API_KEY;
            const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${value}`);
            const data = await response.json();
            setResults(data.Search || []);
            setIsLoading(false);
        })()
    }, [])

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Tabs defaultValue="search" className="w-full">
                <div className="flex flex-col items-center gap-8 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="search" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            Search
                        </TabsTrigger>
                        <TabsTrigger value="watchlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            Watch List
                        </TabsTrigger>
                        <TabsTrigger value="completedlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            Completed List
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="search" className="flex flex-col items-center gap-8 mt-8">
                    <div className="relative w-full max-w-xl">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <form onSubmit={handleSearch} className="w-full">
                            <Input
                                type="text"
                                placeholder="Search for movies and TV shows..."
                                className="pl-10 w-full h-12 text-lg bg-background border-border/40 focus-visible:ring-primary"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                            />
                        </form>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <h3 className="text-lg font-semibold">Searching...</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Looking for movies and TV shows
                            </p>
                        </div>
                    ) : !results.length ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SearchX className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No results found</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Try searching with different keywords
                            </p>
                        </div>
                    ) : (
                        <div className="flex justify-center w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-fit">
                                {results.map((result, index) => (
                                    <SearchItem key={index} item={result} />
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="watchlist" className="mt-8">
                    <WatchList />
                </TabsContent>

                <TabsContent value="completedlist" className="mt-8">
                    <CompletedList />
                </TabsContent>
            </Tabs>
        </div>
    )
}