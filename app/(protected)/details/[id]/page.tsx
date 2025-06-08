import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type DetailsProps = {
  params: {
    id: string;
  };
};

export default async function Details( { params } : DetailsProps ) {

    const apikey: string | undefined = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const data: MediaDetails = (await (await fetch(`http://www.omdbapi.com/?apikey=${apikey}&i=${params.id}&plot=full`)).json());

    return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Title and basic info */}
      <section className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-1/3 aspect-[2/3]">
          <Image
            src={data.Poster}
            alt={data.Title}
            fill
            className="object-cover rounded-2xl shadow-md"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">
            {data.Title} <span className="text-muted-foreground">({data.Year})</span>
          </h1>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{data.Rated}</Badge>
            <Badge variant="outline">{data.Runtime}</Badge>
            <Badge variant="outline">{data.Genre}</Badge>
            <Badge variant="outline">{data.Language}</Badge>
          </div>

          <Separator />

          <p className="text-lg text-muted-foreground">{data.Plot}</p>
        </div>
      </section>

      {/* Credits and meta */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Details</h2>
        <p><strong>Director:</strong> {data.Director}</p>
        <p><strong>Writer:</strong> {data.Writer}</p>
        <p><strong>Actors:</strong> {data.Actors}</p>
        <p><strong>Awards:</strong> {data.Awards}</p>
        <p><strong>Country:</strong> {data.Country}</p>
      </section>

      <Separator />

      {/* Ratings */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Ratings</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>IMDb: {data.imdbRating} ({data.imdbVotes} votes)</Badge>
          {data.Ratings.map((rating, i) => (
            <Badge key={i} variant="secondary">
              {rating.Source}: {rating.Value}
            </Badge>
          ))}
        </div>
      </section>
    </main>
  );
}