"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

const reviewSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  review_text: z.string().min(1, "Review text is required"),
  is_approved: z.boolean(),
  is_featured: z.boolean(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewDialog({ 
  reviewId,
  initialData, 
  trigger
}: { 
  reviewId: string;
  initialData: ReviewFormValues;
  trigger: React.ReactElement;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").update(data).eq("id", reviewId);
      if (error) throw error;
      
      setOpen(false);
      router.refresh();
      toast.add({ title: "Success", description: "Review updated successfully.", type: "success" });
    } catch (error: any) {
      toast.add({ title: "Error", description: "Failed to save review: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input id="customer_name" {...form.register("customer_name")} />
            {form.formState.errors.customer_name && <p className="text-sm text-red-500">{form.formState.errors.customer_name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input id="rating" type="number" min="1" max="5" {...form.register("rating")} />
            {form.formState.errors.rating && <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review_text">Review</Label>
            <Textarea id="review_text" rows={4} {...form.register("review_text")} />
            {form.formState.errors.review_text && <p className="text-sm text-red-500">{form.formState.errors.review_text.message}</p>}
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={form.watch("is_approved")}
                onCheckedChange={(val) => form.setValue("is_approved", val)}
              />
              <Label>Approved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={form.watch("is_featured")}
                onCheckedChange={(val) => form.setValue("is_featured", val)}
              />
              <Label>Featured</Label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-purple hover:bg-brand-purple-deep">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ReviewRowActions({ review }: { review: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this review?")) {
      setIsProcessing(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("reviews").delete().eq("id", review.id);
        if (error) throw error;
        router.refresh();
        toast.add({ title: "Success", description: "Review deleted.", type: "success" });
      } catch (error: any) {
        toast.add({ title: "Error", description: "Failed to delete review: " + error.message, type: "error" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", review.id);
      if (error) throw error;
      router.refresh();
      toast.add({ title: "Success", description: "Review approved.", type: "success" });
    } catch (error: any) {
      toast.add({ title: "Error", description: "Failed to approve review: " + error.message, type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    // Rejecting just deletes it, so they don't pile up as pending forever.
    if (confirm("Are you sure you want to reject and delete this review?")) {
      setIsProcessing(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("reviews").delete().eq("id", review.id);
        if (error) throw error;
        router.refresh();
        toast.add({ title: "Success", description: "Review rejected.", type: "success" });
      } catch (error: any) {
        toast.add({ title: "Error", description: "Failed to reject review: " + error.message, type: "error" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const initialData = {
    customer_name: review.customer,
    rating: review.rating,
    review_text: review.text,
    is_approved: review.is_approved,
    is_featured: review.is_featured,
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {review.status === "Pending" && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleApprove}
            disabled={isProcessing}
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" 
            title="Approve"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReject}
            disabled={isProcessing}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <ReviewDialog 
        reviewId={review.id}
        initialData={initialData}
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-purple" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isProcessing}
        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
