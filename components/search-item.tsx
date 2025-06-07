import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle, CardContent, CardAction } from "./ui/card";

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
                    <CardTitle>{item.Title}</CardTitle>
                    <CardDescription>
                        {item.Type} &bull; {item.Year}
                    </CardDescription>
                        <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">details {">"}</a>
                </div>
            </CardContent>
        </Card>
    );
}
