"use client";

import { useState, useEffect } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  rating: number;
  customer_name: string;
  created_at: string;
  review_text: string;
}

export function ProductReviews({ productId, initialReviews }: { productId: string, initialReviews: Review[] }) {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [rating, setRating] = useState(5);
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
        title: "Review Submitted",
        description: "Thank you! Your review has been submitted and is pending approval.",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        type: "error"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="mt-16 border-t border-border/40 pt-12">
      <h2 className="text-2xl font-bold font-heading text-brand-purple mb-8">Customer Reviews</h2>
      
      {/* Review Form */}
      {!hasReviewed ? (
        <div className="bg-white p-6 rounded-xl border border-border/40 mb-8 max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    type="button" 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${rating >= star ? 'text-brand-gold' : 'text-gray-300 hover:text-brand-gold-soft'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Review</label>
              <Textarea required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="What did you like or dislike about this product?" rows={4} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-purple hover:bg-brand-purple-deep">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-8 max-w-2xl">
          <p className="font-medium">You have already reviewed this product.</p>
          <p className="text-sm mt-1">Thank you for your feedback!</p>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {initialReviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          initialReviews.map((review) => (
            <div key={review.id} className="border-b border-border/40 pb-6 last:border-0 max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} />
                <span className="font-semibold text-foreground">{review.customer_name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{review.review_text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
