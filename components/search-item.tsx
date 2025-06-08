import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle, CardContent, CardAction, CardFooter } from "./ui/card";

type prop = {
    item: SearchItem;
};

export default function SearchItem({ item }: prop) {
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
                    <Button type="submit" className="w-full">
                        add to watch list
                    </Button>
                    <Button variant="outline" className="w-full">
                        add to completed list
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
