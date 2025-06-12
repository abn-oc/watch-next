"use client";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "./ui/card";

type Review = {
  uid: string;
  oid: string;
  content: string;
  created_at: string;
};

type ReviewsProps = {
  oid: string;
};

export default function Reviews({ oid }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [input, setInput] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("oid", oid)
        .order("created_at", { ascending: false });

      const { data: userReviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("uid", user.id)
        .eq("oid", oid)
        .maybeSingle(); // ← Fix: use maybeSingle()

      setReviews(reviewsData || []);
      setUserReview(userReviewData);
      if (userReviewData) {
        setInput(userReviewData.content);
      }
    };

    fetchReviews();
  }, [oid]);

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (userReview) {
      const { error } = await supabase
        .from("reviews")
        .update({ content: input })
        .eq("uid", user.id)
        .eq("oid", oid);

      if (!error) {
        setUserReview({ ...userReview, content: input });
        setReviews(reviews.map((review) =>
          review.uid === user.id ? { ...review, content: input } : review
        ));
      }
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            uid: user.id,
            oid,
            content: input,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setUserReview(data);
        setReviews([data, ...reviews]);
        setInput("");
      }
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Reviews</h2>

      {/* Review Input */}
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Write your review..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!input.trim()}>
            {userReview ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Display Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={`${review.uid}-${review.oid}`}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{review.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet.</p>
      )}
    </section>
  );
}
