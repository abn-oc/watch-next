"use client";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type Review = {
  uid: string;
  oid: string;
  content: string;
  created_at: string;
};

type Profile = {
  uid: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

type ReviewWithProfile = Review & { profile?: Profile };

type ReviewsProps = {
  oid: string;
};

export default function Reviews({ oid }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [input, setInput] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchReviewsAndProfiles = async () => {
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
        .maybeSingle();

      // Fetch profiles of all reviewers
      const uids = (reviewsData || []).map((r) => r.uid);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("uid", uids);

      const reviewsWithProfiles: ReviewWithProfile[] = (reviewsData || []).map((review) => ({
        ...review,
        profile: profilesData?.find((p) => p.uid === review.uid),
      }));

      setReviews(reviewsWithProfiles);
      setUserReview(userReviewData);
      if (userReviewData) {
        setInput(userReviewData.content);
      }
    };

    fetchReviewsAndProfiles();
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
        .insert([{ uid: user.id, oid, content: input }])
        .select()
        .single();

      if (!error && data) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("uid", user.id)
          .single();

        const newReview: ReviewWithProfile = { ...data, profile };
        setUserReview(data);
        setReviews([newReview, ...reviews]);
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
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  {review.profile?.avatar_url ? (
                    <Image
                      src={review.profile.avatar_url}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                  )}

                  {review.profile ? (
                    <HoverCard>
                      <HoverCardTrigger className="text-sm font-medium underline cursor-pointer">
                        {review.profile.username || "Anonymous"}
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64 text-sm text-muted-foreground">
                        {review.profile.bio || "No bio available."}
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unknown user</span>
                  )}
                </div>
                <p className="text-sm">{review.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
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
