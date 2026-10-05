"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  customer_name: string;
  created_at: string;
  review_text: string;
}

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const fieldClass =
  "h-12 rounded-xl border-input bg-white px-4 text-base focus-visible:border-brand-purple focus-visible:ring-3 focus-visible:ring-brand-purple/15";

export function ProductReviews({ productId, initialReviews }: { productId: string, initialReviews: Review[] }) {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const reviewedProducts = JSON.parse(localStorage.getItem("reviewedProducts") || "[]");
    if (reviewedProducts.includes(productId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasReviewed(true);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasReviewed) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          rating,
          review_text: reviewText,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      const reviewedProducts = JSON.parse(localStorage.getItem("reviewedProducts") || "[]");
      reviewedProducts.push(productId);
      localStorage.setItem("reviewedProducts", JSON.stringify(reviewedProducts));
      setHasReviewed(true);
      toast.add({
        title: "Review sent",
        description: "It will appear here once it's approved.",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Review not sent",
        description: "Check your connection and try again.",
        type: "error"
      });
    }

    setIsSubmitting(false);
  };

  const average = initialReviews.length
    ? initialReviews.reduce((sum, r) => sum + r.rating, 0) / initialReviews.length
    : 0;
  const shownRating = hoverRating || rating;

  return (
    <section id="reviews" className="mt-20 scroll-mt-24 border-t border-border pt-14" aria-labelledby="reviews-heading">
      <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        {/* Review list */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="reviews-heading">Reviews</h2>
            {initialReviews.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="tabular font-heading font-semibold text-4xl text-brand-purple">{average.toFixed(1)}</span>
                <div>
                  <StarRating rating={average} />
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    from {initialReviews.length} {initialReviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {initialReviews.length === 0 ? (
            <p className="mt-6 max-w-md text-[15px] text-muted-foreground">
              No one has reviewed this piece yet. If you own it, tell others what you think.
            </p>
          ) : (
            <ul className="mt-8 divide-y divide-border">
              {initialReviews.map((review) => (
                <li key={review.id} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream font-heading font-semibold text-lg text-brand-purple">
                      {review.customer_name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold text-foreground">{review.customer_name}</span>
                    <StarRating rating={review.rating} size="sm" />
                    <time dateTime={review.created_at} className="ml-auto text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-foreground/80">{review.review_text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Review form */}
        <div className="h-fit rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-24">
          {!hasReviewed ? (
            <>
              <h3>Write a review</h3>
              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <fieldset>
                  <legend className="mb-2 text-[15px] font-semibold text-foreground">Your rating</legend>
                  <div className="flex items-center gap-3" onMouseLeave={() => setHoverRating(0)}>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          aria-label={`${star} out of 5 stars`}
                          aria-pressed={rating === star}
                          className="press p-1"
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors duration-150",
                              shownRating >= star ? "fill-brand-gold text-brand-gold" : "fill-transparent text-border"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-brand-gold-deep">{RATING_WORDS[shownRating]}</span>
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="review-name" className="mb-2 block text-[15px] font-semibold text-foreground">Name</label>
                  <Input id="review-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="How your name appears" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="review-text" className="mb-2 block text-[15px] font-semibold text-foreground">Review</label>
                  <Textarea
                    id="review-text"
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How does it look and feel? Would you gift it?"
                    rows={4}
                    className="rounded-xl border-input bg-white px-4 py-3 text-base focus-visible:border-brand-purple focus-visible:ring-3 focus-visible:ring-brand-purple/15"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="press flex h-12 w-full items-center justify-center rounded-full bg-brand-purple text-[15px] font-semibold text-white hover:bg-brand-purple-light disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Send review"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <p className="font-heading font-semibold text-2xl text-brand-purple">Thank you</p>
              <p className="mt-2 text-[15px] text-muted-foreground">
                You&apos;ve reviewed this piece. Your review shows here once it&apos;s approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
