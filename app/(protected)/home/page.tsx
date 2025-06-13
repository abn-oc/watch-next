"use client"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import WatchList from "@/components/watchlist";
import CompletedList from "@/components/completedlist";

export default function Search() {
  const router = useRouter();
  const [value, setValue] = useState<string>('');

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/home/results/${encodeURIComponent(value)}`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="search" className="w-full">
        <div className="flex flex-col items-center gap-8 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Watchlist</h1>
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